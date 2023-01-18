import { selectEncryptedSections } from "/did/decryptedSections";
import { assertElemEq, assertStats } from "/testing/assert";

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

testSelectEncryptedSections();

assertStats();
