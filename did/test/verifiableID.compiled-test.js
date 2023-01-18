import { nth } from "/crypto/secp256k1";
import { keccak256, keccak256Uint32 } from "/crypto/sha3";
import { generate } from "/did/verifiableID";
import evm from "/ethereum/evm";
import { assertEq, assertStats } from "/testing/assert";
import { hex, hexten } from "/util/çevir";

const vm = {};

/**
 * @param {string} privKey
 * @return {string}
 */
vm.addr = (privKey) => {
  const { /** !bigint */ x, /** !bigint */ y } = nth(BigInt("0x" + privKey));
  /** @const {!Uint8Array} */
  const buff = hexten(evm.uint256(x) + evm.uint256(y));
  return "0x" + hex(new Uint8Array(
    keccak256Uint32(new Uint32Array(buff.buffer)).buffer, 12, 20));
}

const testG = () => {
  /** @const {string} */
  const secret = "ff29a2ff68902807fa467f058e6df29ca79935ab6e8aec40011adbcbe2db099b";
  /** @const {!did.HumanID} */
  const humanID = /** @type {!did.HumanID} */(generate("TR22345678902", secret));

  assertEq(evm.signerAddress(keccak256("TR22345678902"), humanID.g), vm.addr(secret));
}

testG();

assertStats();
