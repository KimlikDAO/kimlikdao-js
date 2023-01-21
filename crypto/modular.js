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
 * Computes a^x (mod M) and outputs the least positive representation.
 * The function is not constant time and should not be used in cases where
 * side-channel attacks are possible.
 *
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} M
 * @return {!bigint} a^x (mod M)
 */
const exp = (a, x, M) => {
  /** @type {!bigint} */
  let res = 1n;
  a %= M;
  for (; x; x >>= 1n) {
    if (x & 1n) res = (res * a) % M;
    a = (a * a) % M;
  }
  return res;
}

export { exp, inverse };
