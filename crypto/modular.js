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
  /** @const {string} */
  const xBits = x.toString(2);
  a %= M;
  /** @type {!bigint} */
  let r = xBits.charCodeAt(0) == 49 ? a : 1n;
  for (let i = 1; i < xBits.length; ++i) {
    r = r * r % M;
    if (xBits.charCodeAt(i) == 49) r = r * a % M;
  }
  return r;
}

/**
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} b
 * @param {!bigint} y
 * @param {!bigint} M
 * @return {!bigint} a^x b^y (mod M)
 */
const expTimesExp = (a, x, b, y, M) => {
  /** @type {string} */
  let xBits = x.toString(2);
  /** @type {string} */
  let yBits = y.toString(2);
  if (xBits.length > yBits.length)
    yBits = yBits.padStart(xBits.length, "0");
  else if (yBits.length > xBits.length)
    xBits = xBits.padStart(yBits.length, "0");
  /** @const {!Array<!bigint>} */
  const d = [1n, a, b, a * b % M];
  /** @type {!bigint} */
  let r = d[(xBits.charCodeAt(0) - 48) + 2 * (yBits.charCodeAt(0) - 48)];
  for (let i = 1; i < xBits.length; ++i) {
    r = r * r % M;
    r = r * d[(xBits.charCodeAt(i) - 48) + 2 * (yBits.charCodeAt(i) - 48)] % M;
  }
  return r;
}

export { exp, expTimesExp, inverse };
