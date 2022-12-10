import { keccak256, keccak256Uint32, keccak256Uint8 } from "../../crypto/sha3";
import { assert, assertElemEq, assertStats } from "../../testing/assert";
import { base64, hexten, hex, base64ten } from "../../util/çevir";
import { completeHash, selectEncryptedInfos, verifyMerkleProof } from "../infoSection";

const testSelectEncryptedInfos = () => {
  /** @const {!Array<string>} */
  const encryptedInfosKeys = [
    "a",
    "a,b",
    "a,b,c",
    "a,b,c,d",
    "b,c,d",
    "c,d",
    "c,d,e",
    "A,B,C,E,F,G",
    "A,B,D,E,F,G",
    "A,C,D,X,Y",
    "B,C,D,Z,T",
    "1,2,u",
    "1,3,u,v",
    "1,4,u,v,s",
  ];

  const check = (infoSections, expected) =>
    assertElemEq(
      selectEncryptedInfos(encryptedInfosKeys, infoSections),
      expected
    );

  const testSimple = () => {
    check(["a"], ["a"]);
    check(["b"], ["a,b"]);
    check(["c"], ["c,d"]);
    check(["d"], ["c,d"]);
    check(["e"], ["c,d,e"]);
    check(["a", "b"], ["a,b"]);
    check(["a", "c"], ["a,b,c"]);
    check(["a", "b", "d"], ["a,b,c,d"]);
  }

  const testTwoUnlockables = () => {
    check(["a", "e"], ["a", "c,d,e"]);
    check(["b", "e"], ["b,c,d", "c,d,e"]);
    check(["a", "b", "e"], ["a,b", "c,d,e"]);

    check(["A", "B", "C", "D"], ["A,B,C,E,F,G", "A,B,D,E,F,G"])
  }

  const testGreedy = () => {
    check(["1", "2", "3", "4"], ["1,2,u", "1,3,u,v", "1,4,u,v,s"]);
    check(["a", "e", "1", "2"], ["a", "c,d,e", "1,2,u"]);
    check(["a", "e", "1", "2", "4"], ["a", "c,d,e", "1,2,u", "1,4,u,v,s"]);
  }
  testSimple();
  testTwoUnlockables();
  testGreedy();
}

const testVerifyMerkleProof = () => {
  /**
   * FakeInfoSection
   *
   * @constructor
   * @implements {did.InfoSection}
   */
  const FIS = function (name) {
    this.name = name;
    this.signatureTs = 0;
    this.secp256k1 = "";
    this.bls12_381 = "";
  }

  const concat = (...arrays) => {
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      result.set(arr, pad);
      pad += arr.length;
    }
    return result;
  }
  const aHash = completeHash(new FIS("a"));
  const bHash = completeHash(new FIS("b"));
  const cHash = completeHash(new FIS("c"));
  const dHash = completeHash(new FIS("d"));

  /** @const {!Object<string, !did.EncryptedInfos>} */
  const encryptedInfosMap = {
    "a,b,c": /** @type {did.EncryptedInfos} */({
      merkleRoot: base64(keccak256Uint8(concat(
        hexten(aHash),
        hexten(bHash),
        hexten(cHash)
      )))
    }),
    "a,b,d": /** @type {did.EncryptedInfos} */({
      merkleRoot: base64(keccak256Uint8(concat(
        hexten(aHash),
        hexten(bHash),
        hexten(dHash)
      )))
    }),
  }

  const merkleProof = {
    "a,b,c": base64(concat(
      hexten(aHash),
      hexten(bHash),
      hexten(cHash))),
    "a,b,d": base64(concat(
      hexten(aHash),
      hexten(bHash),
      hexten(dHash))),
  }

  assert(verifyMerkleProof(merkleProof, encryptedInfosMap, {
    "a": new FIS("a"), "b": new FIS("b"), "c": new FIS("c")
  }));

  assert(verifyMerkleProof(merkleProof, encryptedInfosMap, {
    "a": new FIS("a"), "b": new FIS("b"), "d": new FIS("d")
  }));

  assert(!verifyMerkleProof(merkleProof, encryptedInfosMap, {
    "a": new FIS("a"), "b": new FIS("b"), "f": new FIS("f")
  }))
}

testSelectEncryptedInfos();
testVerifyMerkleProof();
assertStats();
