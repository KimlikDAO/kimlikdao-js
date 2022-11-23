import { assert, assertStats } from "../../testing/assert";
import { G, N, O } from "../secp256k1";

const equal = (p, q) => {
  q.normalize();
  p.normalize();
  return p.x == q.x && p.y == q.y;
}

const testCopy = () => {
  const P = G.copy();
  const Q = G.copy();
  assert(equal(P, G));
  assert(equal(P, Q));
}

const testIdentityElement = () => {
  const P = G.copy();
  P.increment(O);
  assert(equal(P, G));

  const Q = O.copy();
  Q.increment(G);
  assert(equal(Q, G));

  const R = O.copy();
  R.increment(O);
  assert(equal(R, O));

  const S = O.copy();
  S.double();
  assert(equal(S, O));

  const T = O.copy();
  T.multiply(5n);
  assert(equal(T, O));

  const U = O.copy();
  U.multiply(0n);
  assert(equal(U, O));

  const V = G.copy();
  V.multiply(0n);
  assert(equal(V, O));
}

const testIdentityElementFuzz = () => {
  for (let i = 0; i < 1000; ++i) {
    const iG = G.copy();
    iG.multiply(BigInt(i) + 1231283129313123123n);
    const iGG = iG.copy();
    iG.increment(O);
    assert(equal(iG, iGG));
  }
}

const testNormalize = () => {
  const OO = O.copy();
  OO.normalize();
  assert(equal(OO, O));

  const GG = G.copy();
  GG.normalize();
  assert(equal(GG, G));
}

const testGroupOrder = () => {
  let nG = G.copy();
  nG.multiply(N);
  assert(equal(nG, O));
}

const test2GEquivalence = () => {
  let G1 = G.copy();
  G1.double();

  let G2 = G.copy();
  G2.multiply(2n);

  let G3 = G.copy();
  G3.increment(G3);

  assert(equal(G1, G2));
  assert(equal(G2, G3));
  assert(equal(G1, G3));
}

const testDouble = () => {
  let P = G.copy();
  P.double();
  P.double();
  P.double();

  let Q = G.copy();
  Q.multiply(8n);

  assert(equal(P, Q));

  P.double();
  Q.increment(Q);

  assert(equal(P, Q));
}

testCopy();
testIdentityElement();
testIdentityElementFuzz();
testNormalize();
testGroupOrder();
test2GEquivalence();
testDouble();
assertStats();
