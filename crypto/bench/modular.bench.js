import { assertEq, assertStats } from "../../testing/assert";
import { exp, expTimesExp } from "../modular";

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

const benchExpTimesExp = () => {
  /** @const {!bigint} */
  const Q = BigInt("0x"
    + "DAD19B08F618992D3A5367F0E730B97C6DD113B6A2A493C9EDB0B68DBB1AEC02"
    + "0FB2A64C9644397AB016ABA5B40FA22655060824D9F308984D6734E2439BA08F");

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

benchExpTimesExp();

assertStats();
