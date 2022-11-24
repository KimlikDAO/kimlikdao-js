import { assert, assertStats } from "../../testing/assert";
import { equal, G, N, O } from "../secp256k1";

const benchMultiplyBeginEnd = () => {
  console.time("benchMultiplyBeginEnd (5k multiply's)");
  for (let i = 0; i < 5000; ++i) {
    const k = BigInt(i);
    const P = G.copy().multiply(k);
    const Q = G.copy().multiply(N - k);
    P.increment(Q);

    assert(equal(P, O));
  }
  console.timeEnd("benchMultiplyBeginEnd (5k multiply's)");
}

const benchMultiplyMiddle = () => {
  const delta = N / 2n;
  console.time("benchMultiplyMiddle (5k multiply's)");
  for (let i = 0; i < 5000; ++i) {
    const k = BigInt(i) + delta;
    const P = G.copy().multiply(k);
    const Q = G.copy().multiply(N - k);
    P.increment(Q);

    assert(equal(P, O));
  }
  console.timeEnd("benchMultiplyMiddle (5k multiply's)");
}

benchMultiplyBeginEnd();
benchMultiplyMiddle();
assertStats();
