import { inverse, exp } from "/crypto/modular";
import { assertEq, assertStats } from "/testing/assert";

/**
 * Prime used in the secp256k1 curve.
 *
 * @const {!bigint}
 */
const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");

const testInverse = () => {
  for (let i = 0; i < 10000; ++i) {
    const n = BigInt(i);
    assertEq(inverse(inverse(n, P), P), n);
  }

  for (let i = 0; i < 10000; ++i) {
    const n = P - BigInt(i) - 1n;
    assertEq(inverse(inverse(n, P), P), n);
  }

  for (let i = 0; i < 10000; ++i) {
    const x = BigInt(i);
    const x2 = (x * x) % P;
    const ix = inverse(x, P);
    const ix2 = (ix * ix) % P;
    assertEq(inverse(x2, P), ix2);
  }

  for (let i = 0; i < 10000; ++i) {
    const x = BigInt(i) + 123123123123n;
    const x3 = (x * x * x) % P;
    const ix = inverse(x, P);
    const ix3 = (ix * ix * ix) % P;
    assertEq(inverse(x3, P), ix3);
  }

  for (let /** !bigint */ p of [3n, 5n, 7n, 11n, P]) {
    assertEq(inverse(1n, p), 1n)
    assertEq(inverse(0n, p), 0n)
    assertEq(inverse(p - 1n, p), p - 1n);
    assertEq(inverse(4n, inverse(p - 1n, p)), inverse(4n, p - 1n))
  }

  assertEq(inverse(0n, P), 0n);
  assertEq(inverse(1n, P), 1n);
  assertEq(inverse(P - 1n, P), P - 1n);
}

const testModularExp = () => {
  /** @const {!bigint} */
  const P = BigInt('0xDAD19B08F618992D3A5367F0E730B97C6DD113B6A2A493C9EDB0B68DBB1AEC020FB2A64C9644397AB016ABA5B40FA22655060824D9F308984D6734E2439BA08F')

  assertEq(exp(7n, 5n, 11n), 10n);
  assertEq(exp(2n, 5n, 3n), 2n);
  assertEq(exp(9n, 0n, 5n), 1n);

  assertEq(exp(5n, P - 1n, P), 1n)
  assertEq(exp(333n, P - 1n, P), 1n)
  assertEq(exp(11n, P - 1n, P), 1n)
}

testModularExp();
testInverse();
assertStats();
