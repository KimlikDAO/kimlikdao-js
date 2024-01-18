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
  const ops = pushNumber(BigInt(amountSzabos) * SZABO);
  // val | 0 0 0 0 
  for (const recipient of recipients)
    ops.push(Op.PUSH0, Op.PUSH0, Op.PUSH0, Op.PUSH0, Op.DUP5,
      Op.PUSH20, address(recipient), Op.PUSH0, Op.CALL, Op.POP);
  return toByteCode(ops.slice(0, -1));
}


/**
 * Generates a batchSend bytecode for an EVM chain that doesn't support
 * the PUSH0 opcode.
 *
 * @param {!Array<!Address>} addresses
 * @param {number} amountSzabos
 * @return {!ByteCode}
 */
const batchSendFixedAmountNoPush0 = (recipients, amountSzabos) => {
  /** @const {!Array<!Op|!OpData>} */
  const ops = [
    ...pushNumber(BigInt(amountSzabos) * SZABO),
    ...pushNumber(0n)
  ];
  // val 0 | 0 0 0 0 val addr
  for (const recipient of recipients)
    ops.push(Op.DUP1, Op.DUP1, Op.DUP1, Op.DUP1, Op.DUP6,
      Op.PUSH20, address(recipient), Op.DUP3, Op.CALL, Op.POP);
  return toByteCode(ops.slice(0, -1));
}

export {
  Address,
  ByteCode,
  SZABO,
  batchSendFixedAmount,
  batchSendFixedAmountNoPush0,
  toByteCode
};
