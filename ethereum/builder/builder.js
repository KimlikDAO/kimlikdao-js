import { hexten } from "../../util/çevir";
import { Op, OpData, pushNumber } from "./opcodes";

/** @typedef {string} */
const Address = {};
/** @typedef {!Uint8Array} */
const ByteCode = {};

/** @const {!bigint} */
const SZABO = 10n ** 12n;

/**
 * @param {!Address} addr
 * @return {!OpData}
 */
const address = (addr) => {
  if (addr.startsWith("0x")) addr = addr.slice(2);
  return addr.toUpperCase();
}

/**
 * @param {!Array<!Op|!OpData>} ops
 * @return {!ByteCode}
 */
const toByteCode = (ops) => hexten(ops.join(""));

/**
 * @param {!Array<!Address>} addresses
 * @param {number} amountSzabos
 * @return {!ByteCode}
 */
const batchSendFixedAmount = (recipients, amountSzabos) => {
  /** @const {!Array<!Op|!OpData>} */
  const ops = new Array();
  /** @const {!Array<!Op|!OpData>} */
  const val = pushNumber(BigInt(amountSzabos) * SZABO);
  for (const recipient of recipients)
    ops.push(Op.PUSH0, Op.PUSH0, Op.PUSH0, Op.PUSH0, ...val, Op.PUSH20, address(recipient), Op.PUSH0, Op.CALL);
  return toByteCode(ops);
}

export {
  Address,
  ByteCode,
  SZABO,
  batchSendFixedAmount,
  toByteCode
};

