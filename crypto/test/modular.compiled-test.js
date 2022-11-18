import { assert, assertStats } from "../../testing/assert";
import { inverse } from "../modular";
import { P } from "../secp256k1";

const testInverse = () => {
  for (let i = 0; i < 10000; ++i) {
    const n = BigInt(i);
    assert(inverse(inverse(n, P), P) == n);
  }

  for (let i = 0; i < 10000; ++i) {
    const n = P - BigInt(i) - 1n;
    assert(inverse(inverse(n, P), P) == n);
  }

  for (let i = 0; i < 10000; ++i) {
    const x = BigInt(i);
    const x2 = (x * x) % P;
    const ix = inverse(x, P);
    const ix2 = (ix * ix) % P;
    assert(ix2 == inverse(x2, P));
  }

  for (let i = 0; i < 10000; ++i) {
    const x = BigInt(i);
    const x2 = (x * x) % P;
    const ix = inverse(x, P);
    const ix2 = (ix * ix) % P;
    assert(ix2 == inverse(x2, P));
  }

  for (let i = 0; i < 10000; ++i) {
    const x = BigInt(i) + 123123123123n;
    const x3 = (x * x * x) % P;
    const ix = inverse(x, P);
    const ix3 = (ix * ix * ix) % P;
    assert(ix3 == inverse(x3, P));
  }

  for (let x of [3n, 5n, 7n, 11n, P]) {
    assert(inverse(1n, x) == 1n)
    assert(inverse(0n, x) == 0n)
    assert(inverse(4n, inverse(x-1n, x)) ==  inverse(4n, x-1n))
  }

  assert(inverse(0n, P) == 0n);
  assert(inverse(1n, P) == 1n);
  assert(inverse(4n, inverse(P-1n, P)) ==  inverse(4n, P-1n))

}

testInverse();
assertStats();
