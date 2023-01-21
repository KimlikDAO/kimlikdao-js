import { assertEq, assertStats } from "../../testing/assert";
import { exp, expTimesExp } from "../modular";

/**
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} M
 * @return {!bigint} a^x (mod M)
 */
const expLTRBinary = (a, x, M) => {
  /** @const {string} */
  const xBits = x.toString(2);
  a %= M;
  /** @type {!bigint} */
  let r = xBits[0] == '1' ? a : 1n;
  for (let i = 1; i < xBits.length; ++i) {
    r = r * r % M;
    if (xBits.charCodeAt(i) == 49) r = r * a % M;
  }
  return r;
}

/**
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} M
 * @return {!bigint} a^x (mod M)
 */
const expViaBigInt = (a, x, M) => {
  /** @type {!bigint} */
  let res = 1n;
  a %= M;
  for (; x; x >>= 1n) {
    if (x & 1n) res = (res * a) % M;
    a = (a * a) % M;
  }
  return res;
}

/**
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} M
 * @return {!bigint} a^x (mod M)
 */
const expLTRBinary2 = (a, x, M) => {
  /** @const {string} */
  const xBits = x.toString(2);
  a %= M;
  /** @type {!bigint} */
  let r = xBits[0] == '1' ? a : 1n;
  /** @const {number} */
  const n = xBits.length;
  for (let i = 1; i < n; ++i) {
    r *= r; r %= M;
    if (xBits[i] == "1") {
      r *= a; r %= M;
    }
  }
  return r;
}

/**
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} M
 * @return {!bigint} a^x (mod M)
 */
const expRTLBinary = (a, x, M) => {
  /** @const {string} */
  const xBits = x.toString(2);
  a %= M;
  /** @type {!bigint} */
  let r = 1n;
  for (let i = xBits.length - 1; i >= 0; --i) {
    if (xBits.charCodeAt(i) == 49) r = r * a % M;
    a = a * a % M;
  }
  return r;
}

const testExpLocal = () => {
  const testExpLocal = expLTRBinary2;
  /** @const {!bigint} */
  const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
  /** @const {!bigint} */
  const Q = BigInt("0x"
    + "DAD19B08F618992D3A5367F0E730B97C6DD113B6A2A493C9EDB0B68DBB1AEC02"
    + "0FB2A64C9644397AB016ABA5B40FA22655060824D9F308984D6734E2439BA08F");

  assertEq(testExpLocal(7n, 5n, 11n), 10n);
  assertEq(testExpLocal(2n, 5n, 3n), 2n);
  assertEq(testExpLocal(9n, 0n, 5n), 1n);

  assertEq(testExpLocal(5n, Q - 1n, Q), 1n)
  assertEq(testExpLocal(333n, Q - 1n, Q), 1n)
  assertEq(testExpLocal(11n, Q - 1n, Q), 1n)

  assertEq(testExpLocal(5n, P - 1n, P), 1n)
  assertEq(testExpLocal(333n, P - 1n, P), 1n)
  assertEq(testExpLocal(11n, P - 1n, P), 1n)

  assertEq(testExpLocal(12n, 78n, 131n), 58n);
  assertEq(testExpLocal(12n, 38n, 133n), 11n);
}

const benchExp = () => {
  /** @const {!bigint} */
  const Q = BigInt("0x"
    + "DAD19B08F618992D3A5367F0E730B97C6DD113B6A2A493C9EDB0B68DBB1AEC02"
    + "0FB2A64C9644397AB016ABA5B40FA22655060824D9F308984D6734E2439BA08F");
  /** @const {!bigint} */
  const R = (Q - 1n) >> 1n;

  console.time("1k exp()");
  {
    for (let i = 0; i < 1000; ++i) {
      assertEq(exp(2n, Q - 1n, Q), 1n);
      assertEq(exp(R, Q - 1n, Q), 1n);
    }
  }
  console.timeEnd("1k exp()");

  console.time("1k expViaBigInt()");
  {
    for (let i = 0; i < 1000; ++i) {
      assertEq(expViaBigInt(2n, Q - 1n, Q), 1n);
      assertEq(expViaBigInt(R, Q - 1n, Q), 1n);
    }
  }
  console.timeEnd("1k expViaBigInt()");

  console.time("1k expLTRBinary()");
  {
    for (let i = 0; i < 1000; ++i) {
      assertEq(expLTRBinary(2n, Q - 1n, Q), 1n);
      assertEq(expLTRBinary(R, Q - 1n, Q), 1n);
    }
  }
  console.timeEnd("1k expLTRBinary()");


  console.time("1k expLTRBinary2()");
  {
    for (let i = 0; i < 1000; ++i) {
      assertEq(expLTRBinary2(2n, Q - 1n, Q), 1n);
      assertEq(expLTRBinary2(R, Q - 1n, Q), 1n);
    }
  }
  console.timeEnd("1k expLTRBinary2()");

  console.time("1k expRTLBinary()");
  {
    for (let i = 0; i < 1000; ++i) {
      assertEq(expRTLBinary(2n, Q - 1n, Q), 1n);
      assertEq(expRTLBinary(R, Q - 1n, Q), 1n);
    }
  }
  console.timeEnd("1k expRTLBinary()");
}

/**
 * @param {!bigint} a
 * @param {!bigint} x
 * @param {!bigint} b
 * @param {!bigint} y
 * @param {!bigint} M
 * @return {!bigint} a^x b^y (mod M)
 */
const expTimesExpViaBigIntMask = (a, x, b, y, M) => {
  /** @const {!bigint} */
  const c = a * b % M;
  /** @const {number} */
  const xLen = x.toString(2).length;
  /** @const {number} */
  const yLen = y.toString(2).length;
  /** @const {number} */
  const len = Math.max(xLen, yLen);
  /** @type {!bigint} */
  let mask = 1n << BigInt(len - 1);
  /** @type {!bigint} */
  let r = (x & mask)
    ? (y & mask) ? c : a
    : (y & mask) ? b : 1n;
  mask >>= 1n;
  for (; mask; mask >>= 1n) {
    r = r * r % M;
    /** @const {!bigint} */
    const d = (x & mask)
      ? (y & mask) ? c : a
      : (y & mask) ? b : 1n;
    r = r * d % M;
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
const expTimesExpW = (a, x, b, y, M) => {
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

const testExpTimesExpLocal = () => {
  console.log("testExpTimesExpLocal()");
  const testExpTimesExpLocal = expTimesExpW;
  assertEq(testExpTimesExpLocal(2n, 2n, 3n, 1n, 100n), 12n);
  assertEq(testExpTimesExpLocal(12n, 38n, 9n, 17n, 133n), 16n);
  assertEq(testExpTimesExpLocal(12n, 38n, 19n, 17n, 133n), 19n);
  assertEq(testExpTimesExpLocal(12n, 38n, 55n, 17n, 133n), 80n);
  assertEq(testExpTimesExpLocal(12n, 38n, 55n, 11231237n, 12938120389123n), 3120026537850n);
}

const benchExpTimesExp = () => {
  /** @const {!bigint} */
  const Q = BigInt("0x"
    + "DAD19B08F618992D3A5367F0E730B97C6DD113B6A2A493C9EDB0B68DBB1AEC02"
    + "0FB2A64C9644397AB016ABA5B40FA22655060824D9F308984D6734E2439BA08F");

  console.time("1k with two exp() round1");
  {
    /** @const {!bigint} */
    const M = (Q - 1n) >> 1n;
    for (let i = 0; i < 1000; ++i) {
      /** @const {!bigint} */
      const r1 = exp(123n, Q - 1n, Q);
      const r2 = exp(15129n, M, Q);
      assertEq(r1 * r2 % Q, 1n);
    }
  }
  console.timeEnd("1k with two exp() round1");

  console.time("1k with two exp()");
  {
    /** @const {!bigint} */
    const M = (Q - 1n) >> 1n;
    for (let i = 0; i < 1000; ++i) {
      /** @const {!bigint} */
      const r1 = exp(123n, Q - 1n, Q);
      const r2 = exp(15129n, M, Q);
      assertEq(r1 * r2 % Q, 1n);
    }
  }
  console.timeEnd("1k with two exp()");

  console.time("1k with expTimesExpViaBigIntMask()");
  {
    /** @const {!bigint} */
    const M = (Q - 1n) >> 1n;
    for (let i = 0; i < 1000; ++i) {
      assertEq(expTimesExpViaBigIntMask(123n, Q - 1n, 15129n, M, Q), 1n);
    }
  }
  console.timeEnd("1k with expTimesExpViaBigIntMask()");

  console.time("1k with expTimesExpW()");
  {
    /** @const {!bigint} */
    const M = (Q - 1n) >> 1n;
    for (let i = 0; i < 1000; ++i) {
      assertEq(expTimesExpW(123n, Q - 1n, 15129n, M, Q), 1n);
    }
  }
  console.timeEnd("1k with expTimesExpW()");

  console.time("1k with expTimesExp()");
  {
    /** @const {!bigint} */
    const M = (Q - 1n) >> 1n;
    for (let i = 0; i < 1000; ++i) {
      assertEq(expTimesExp(123n, Q - 1n, 15129n, M, Q), 1n);
    }
  }
  console.timeEnd("1k with expTimesExp()");
}

testExpLocal();
benchExp();

testExpTimesExpLocal();
benchExpTimesExp();

assertStats();
