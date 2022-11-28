import evm from "../../ethereum/evm";
import { assertEq, assertStats } from "../../testing/assert";
import { hexten } from "../../util/çevir";
import { G, sign } from "../secp256k1";
import { keccak256Uint32 } from "../sha3";

const vm = {};

/**
 * @param {!bigint} privKey
 */
vm.addr = (privKey) => {
  const Q = G.copy().multiply(privKey).project();
  const buff = new Uint8Array(64);
  buff.set(hexten(evm.uint256(Q.x)), 0);
  buff.set(hexten(evm.uint256(Q.y)), 32);
  return "0x" + keccak256Uint32(new Uint32Array(buff.buffer)).slice(24);
}

/**
 * @param {!bigint} digest as bigint
 * @param {!bigint} privKey as bigint
 */
vm.sign = (digest, privKey) => {
  const { r, s, yParity } = sign(digest, privKey);
  return evm.uint256(r) + evm.uint256(s) + (27 + +yParity).toString(16);
}

const testAddr = () => {
  assertEq(vm.addr(1n), "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf");
  assertEq(vm.addr(2n), "0x2b5ad5c4795c026514f8317c7a215e218dccd6cf");
  assertEq(vm.addr(3n), "0x6813eb9362372eef6200f3b1dbc3f819671cba69");
  assertEq(vm.addr(4n), "0x1eff47bc3a10a45d4b230b5d10e37751fe6aa718");
  assertEq(vm.addr(5n), "0xe1ab8145f7e55dc933d51a18c793f901a3a0b276");
  assertEq(vm.addr(6n), "0xe57bfe9f44b819898f47bf37e5af72a0783e1141");
}

console.log(vm.sign(1n, 6n));
testAddr();
assertStats();
