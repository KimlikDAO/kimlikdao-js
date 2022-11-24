import { assert, assertStats } from "../../testing/assert";
import { equal, G, N, O } from "../secp256k1";

const testCopy = () => {
  const P = G.copy();
  const Q = G.copy();
  assert(equal(P, G));
  assert(equal(P, Q));
}

const testIdentityElement = () => {
  const P = G.copy().increment(O);
  assert(equal(P, G));

  const Q = O.copy().increment(G);
  assert(equal(Q, G));

  const R = O.copy().increment(O);
  assert(equal(R, O));

  const S = O.copy().double();
  assert(equal(S, O));

  const T = O.copy().multiply(5n);
  assert(equal(T, O));

  const U = O.copy().multiply(0n);
  assert(equal(U, O));

  const V = G.copy().multiply(0n);
  assert(equal(V, O));
}

const testIdentityElementFuzz = () => {
  for (let i = 0; i < 1000; ++i) {
    const iG = G.copy().multiply(BigInt(i) + 1231283129313123123n);
    const iGG = iG.copy().increment(O);
    assert(equal(iG, iGG));
  }
}

const testNormalize = () => {
  const OO = O.copy().normalize();
  assert(equal(OO, O));

  const GG = G.copy().normalize();
  assert(equal(GG, G));
}

const testGroupOrder = () => {
  let nG = G.copy().multiply(N);
  assert(equal(nG, O));
}

const test2GEquivalence = () => {
  let G1 = G.copy().double();
  let G2 = G.copy().multiply(2n);
  let G3 = G.copy().increment(G);

  assert(equal(G1, G2));
  assert(equal(G2, G3));
  assert(equal(G1, G3));
}

const testDouble = () => {
  let P = G.copy().double().double().double();
  let Q = G.copy().multiply(8n);

  assert(equal(P, Q));

  P.double();
  Q.increment(Q);

  assert(equal(P, Q));
}

const testMultiply = () => {
  for (let i = 0; i < 5000; ++i) {
    const k = BigInt(i) + 8098234098230498234n;
    const P = G.copy().multiply(k);
    const Q = G.copy().multiply(N - k);
    P.increment(Q);

    assert(equal(P, O));
  }
}

testCopy();
testIdentityElement();
testIdentityElementFuzz();
testNormalize();
testGroupOrder();
test2GEquivalence();
testDouble();
testMultiply();
assertStats();
