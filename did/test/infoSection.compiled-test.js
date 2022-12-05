import { assertElemEq, assertStats } from "../../testing/assert";
import { selectUnlockables } from "../infoSection";

/** @const {!eth.ERC721Unlockable} */
const NFT = /** @type {!eth.ERC721Unlockable} */({
  unlockables: {
    "a": { userPrompt: "a" },
    "a,b": { userPrompt: "a,b" },
    "a,b,c": { userPrompt: "a,b,c" },
    "a,b,c,d": { userPrompt: "a,b,c,d" },
    "b,c,d": { userPrompt: "b,c,d" },
    "c,d": { userPrompt: "c,d" },
    "c,d,e": { userPrompt: "c,d,e" },
    "A,B,C,E,F,G": { userPrompt: "A,B,C,E,F,G" },
    "A,B,D,E,F,G": { userPrompt: "A,B,D,E,F,G" },
    "A,C,D,X,Y": { userPrompt: "A,C,D,X,Y" },
    "B,C,D,Z,T": { userPrompt: "B,C,D,Z,T" },
    "1,2,u": { userPrompt: "1,2,u" },
    "1,3,u,v": { userPrompt: "1,3,u,v" },
    "1,4,u,v,s": { userPrompt: "1,4,u,v,s" },
  }
});

const assert = (infoSections, expected) =>
  assertElemEq(
    selectUnlockables(NFT, infoSections).map((e) => e.userPrompt),
    expected
  );

const testSimple = () => {
  assert(["a"], ["a"]);
  assert(["b"], ["a,b"]);
  assert(["c"], ["c,d"]);
  assert(["d"], ["c,d"]);
  assert(["e"], ["c,d,e"]);
  assert(["a", "b"], ["a,b"]);
  assert(["a", "c"], ["a,b,c"]);
  assert(["a", "b", "d"], ["a,b,c,d"]);
}

const testTwoUnlockables = () => {
  assert(["a", "e"], ["a", "c,d,e"]);
  assert(["b", "e"], ["b,c,d", "c,d,e"]);
  assert(["a", "b", "e"], ["a,b", "c,d,e"]);

  assert(["A", "B", "C", "D"], ["A,B,C,E,F,G", "A,B,D,E,F,G"])
}

const testGreedy = () => {
  assert(["1", "2", "3", "4"], ["1,2,u", "1,3,u,v", "1,4,u,v,s"]);
  assert(["a", "e", "1", "2"], ["a", "c,d,e", "1,2,u"]);
  assert(["a", "e", "1", "2", "4"], ["a", "c,d,e", "1,2,u", "1,4,u,v,s"]);
}

testSimple();
testTwoUnlockables();
testGreedy();
assertStats();
