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
    const x2 = (x * x * x) % P;
    const ix = inverse(x, P);
    const ix2 = (ix * ix * ix) % P;
    assert(ix2 == inverse(x2, P));
  }
}

testInverse();
assertStats();
