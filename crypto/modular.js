/**
 * Modular inversion over F_P via the Euclidian algorithm.
 *
 * Requires that b < P and P is a prime.
 *
 * @param {!bigint} b
 * @param {!bigint} P
 * @return {!bigint} x such that bx + Py = 1 and 0 < x < P.
 */
const inverse = (b, P) => {
  /** @type {!bigint} */
  let a = P;
  /** @type {!bigint} */
  let x = 0n;
  /** @type {!bigint} */
  let y = 1n;
  /** @type {!bigint} */
  let t;
  /** @type {!bigint} */
  let q;
  while (b !== 0n) {
    q = a / b;
    t = y; y = x - q * y; x = t;
    t = b; b = a - q * b; a = t;
  }
  if (x < 0n) x += P;
  return x;
}

/**
 * Computes x^n (mod P) and outputs the least positive representation.
 * The function is not constant time and should not be used in cases where
 * side-channel attacks are possible.
 *
 * @param {!bigint} x
 * @param {!bigint} n
 * @param {!bigint} P
 * @return {!bigint} x^n (mod P)
 */
const exp = (x, n, P) => {
  /** @type {!bigint} */
  let res = 1n;
  x %= P;
  for (; n; n >>= 1n) {
    if (!!(n & 1n)) res = (res * x) % P;
    x = (x * x) % P;
  }
  return res;
}

export { exp, inverse };
