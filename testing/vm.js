import { nth, sign } from "../crypto/secp256k1";
import { keccak256Uint32 } from "../crypto/sha3";
import evm from "../ethereum/evm";
import { hex, hexten } from "../util/çevir";

/**
 * @param {!bigint} privKey
 * @return {string}
 */
const addr = (privKey) => {
  const { /** !bigint */ x, /** !bigint */ y } = nth(privKey);
  /** @const {!Uint8Array} */
  const buff = hexten(evm.uint256(x) + evm.uint256(y));
  return "0x" + hex(new Uint8Array(
    keccak256Uint32(new Uint32Array(buff.buffer)).buffer, 12, 20));
}

/**
 * @param {!bigint} digest as bigint
 * @param {!bigint} privKey as bigint
 */
const signWide = (digest, privKey) => {
  const { r, s, yParity } = sign(digest, privKey);
  return evm.uint256(r) + evm.uint256(s) + (27 + +yParity).toString(16);
}

export default {
  addr,
  sign: signWide
};
