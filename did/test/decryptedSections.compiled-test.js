import { keccak256 } from "/crypto/sha3";
import { combineMultiple, selectEncryptedSections, sign } from "/did/decryptedSections";
import { commit, recoverSectionSigners } from "/did/section";
import { assertElemEq, assertEq, assertStats } from "/testing/assert";
import vm from "/testing/vm";

const testSelectEncryptedSections = () => {
  /** @const {!Array<string>} */
  const encryptedSectionsKeys = [
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

  const check = (sections, expected) =>
    assertElemEq(
      selectEncryptedSections(encryptedSectionsKeys, sections),
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

const testCombineMultiple = () => {
  /** @const {string} */
  const ownerAddress = vm.addr(1n);

  /** @const {string} */
  const commitmentR = keccak256("commitmentR");
  /** @const {string} */
  const commitmentAnonR = keccak256("commitmentAnonR");

  /** @const {string} */
  const commitment = commit(ownerAddress, commitmentR);
  /** @const {string} */
  const commitmentAnon = commit(ownerAddress, commitmentAnonR);

  /** @const {!did.DecryptedSections} */
  const tckt = {
    "humanID": /** @type {!did.HumanID} */({
      id: "9e10e195f5c4fb987af3077fe241ff7108d39ed7a3b2908da6a37778ad75ee39",
    }),
    "personInfo": /** @type {!did.PersonInfo} */({
      first: "Kaan",
      last: "Ankara",
    })
  };

  /** @const {!Array<did.DecryptedSections>} */
  const tckts = Array(5).fill({});

  for (let i = 0; i < tckts.length; ++i) {
    tckts[i] = /** @type {!did.DecryptedSections} */(structuredClone(tckt));
    sign(tckts[i], commitment, commitmentAnon, 1337, BigInt(i + 10));
  }

  /** @const {!did.DecryptedSections} */
  const combined = combineMultiple(tckts, commitmentR, commitmentAnonR, 5);

  assertEq(Object.keys(combined).length, Object.keys(tckt).length);

  assertEq(combined["humanID"].secp256k1.length, 5);
  assertEq(combined["personInfo"].secp256k1.length, 5);
  assertEq(combined["humanID"].commitmentR, commitmentAnonR);
  assertEq(combined["personInfo"].commitmentR, commitmentR);

  /** @const {!Array<!bigint>} */
  const signers = [vm.addr(10n), vm.addr(11n), vm.addr(12n), vm.addr(13n), vm.addr(14n)];
  assertElemEq(
    recoverSectionSigners("humanID", combined["humanID"], ownerAddress),
    signers
  );
  assertElemEq(
    recoverSectionSigners("personInfo", combined["personInfo"], ownerAddress),
    signers
  );
}

testSelectEncryptedSections();
testCombineMultiple();

assertStats();
