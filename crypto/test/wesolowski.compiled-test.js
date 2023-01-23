import { evaluate, generateChallenge, reconstructY } from "/crypto/wesolowski";
import { assert, assertEq, assertStats } from "/testing/assert";

const testEvaluateReconstruct = () => {
  /** @const {number} */
  const logT = 5;
  /** @const {number} */
  const t = 32;

  for (let g = 1n; g <= 2000n; ++g) {
    const { y, π, l } = evaluate(g, t);
    const yy = reconstructY(logT, g, π, l);
    assertEq(y, yy);
  }
}

const testGenerateChallenge = () => {
  const c1 = generateChallenge(1n, 2n);
  const c2 = generateChallenge(1n, 3n);
  const c3 = generateChallenge(2n, 2n);

  assert(c1 != c2);
  assert(c1 != c3);
  assert(c2 != c3);
}

testEvaluateReconstruct();
testGenerateChallenge();

assertStats();
