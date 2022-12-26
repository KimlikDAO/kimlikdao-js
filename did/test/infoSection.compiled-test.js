import { G } from "/crypto/secp256k1";
import { keccak256Uint32 } from "/crypto/sha3";
import { hash, recoverInfoSectionSigners, selectEncryptedInfos, signDecryptedInfos } from "/did/infoSection";
import evm from "/ethereum/evm.js";
import { assertElemEq, assertEq, assertStats } from "/testing/assert";
import { base64, hex, hexten } from "/util/çevir";

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

/** @const */
const vm = {};

/**
 * @param {!bigint} privKey
 */
vm.addr = (privKey) => {
  const Q = G.copy().multiply(privKey).project();
  const buff = hexten(evm.uint256(Q.x) + evm.uint256(Q.y));
  return "0x" + hex(keccak256Uint32(new Uint32Array(buff.buffer)).subarray(12));
}

const testSignInfoSection = () => {
  /** @const {!did.DecryptedInfos} */
  const decryptedInfos1 = {
    "humanID": /** @type {!did.HumanID} */({
      generic: "1234A234"
    })
  };

  /** @const {!did.DecryptedInfos} */
  const decryptedInfos2 = {
    "humanID": /** @type {!did.HumanID} */({
      generic: "1234A234",
      bls12_381: "asdfadsf",
      secp256k1: ["incorrect_sign"]
    })
  };

  /** @const {number} */
  const timestamp = ~~(Date.now() / 1000);
  signDecryptedInfos(decryptedInfos1, timestamp, 1n);
  signDecryptedInfos(decryptedInfos2, timestamp, 2n);

  assertEq(decryptedInfos1["humanID"].secp256k1.length, 1);
  assertEq(decryptedInfos2["humanID"].secp256k1.length, 1);
  assertEq(
    recoverInfoSectionSigners("humanID", decryptedInfos1["humanID"])[0],
    vm.addr(1n)
  );
  assertEq(
    recoverInfoSectionSigners("humanID", decryptedInfos2["humanID"])[0],
    vm.addr(2n)
  );

  decryptedInfos1["humanID"].secp256k1.push(
    decryptedInfos2["humanID"].secp256k1[0]);

  assertElemEq(recoverInfoSectionSigners("humanID", decryptedInfos1["humanID"]),
    [vm.addr(1n), vm.addr(2n)]);

  decryptedInfos1["humanID"].secp256k1.push(
    decryptedInfos2["humanID"].secp256k1[0]);

  assertElemEq(recoverInfoSectionSigners("humanID", decryptedInfos1["humanID"]),
    [vm.addr(1n), vm.addr(2n)]);
}

const testHash = () => {
  {
    const buff = new Uint8Array(32);
    buff[31] = buff[30] = buff[29] = 123;
    assertEq(hash("exposureReportID", /** @const {!did.ExposureReportID} */({
      id: base64(buff),
      signatureTs: 123
    })), "43eadff4f6142463dc8d8a271e14406c9b11b166b704c846dcd705439bf321f9");
  }
  {
    const buff = new Uint8Array(32);
    buff[31] = buff[30] = buff[29] = buff[28] = 170;
    assertEq(hash("exposureReportID", /** @const {!did.ExposureReportID} */({
      id: base64(buff),
      signatureTs: 123
    })), "396f822b3d8cef6a211a07d8147540acf33bedf67417277245dac8e04d5ec31d");
  }
  {
    const buff = new Uint8Array(32);
    buff[31] = buff[30] = buff[29] = buff[28] = 170;
    assertEq(hash("exposureReportID", /** @const {!did.ExposureReportID} */({
      id: base64(buff),
      signatureTs: 123123123123
    })), "0a9a3c0c8d1fa507641e0bab6d90adee12cb6a6efa544da55b5ca76b326f1740");
  }
}

testHash();
testSelectEncryptedInfos();
testSignInfoSection();
assertStats();
