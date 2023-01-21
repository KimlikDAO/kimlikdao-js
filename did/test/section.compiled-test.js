import { G } from "/crypto/secp256k1";
import { keccak256Uint32 } from "/crypto/sha3";
import { commit, hash, recoverSectionSigners, signSection } from "/did/section";
import evm from "/ethereum/evm.js";
import { assertElemEq, assertEq, assertStats } from "/testing/assert";
import { base64, hex, hexten } from "/util/çevir";

/** @const */
const vm = {};

/**
 * @param {!bigint} privKey
 * @return {string}
 */
vm.addr = (privKey) => {
  const Q = G.copy().multiply(privKey).project();
  /** @const {!Uint8Array} */
  const buff = hexten(evm.uint256(Q.x) + evm.uint256(Q.y));
  return "0x" + hex(new Uint8Array(
    keccak256Uint32(new Uint32Array(buff.buffer)).buffer, 12, 20));
}

const testHash = () => {
  {
    const buff = new Uint8Array(32);
    buff[31] = buff[30] = buff[29] = 123;
    assertEq(hash("exposureReport", /** @const {!did.ExposureReport} */({
      id: hex(buff),
      signatureTs: 123
    })), "43eadff4f6142463dc8d8a271e14406c9b11b166b704c846dcd705439bf321f9");
  }
  {
    const buff = new Uint8Array(32);
    buff[31] = buff[30] = buff[29] = buff[28] = 170;
    assertEq(hash("exposureReport", /** @const {!did.ExposureReport} */({
      id: hex(buff),
      signatureTs: 123
    })), "396f822b3d8cef6a211a07d8147540acf33bedf67417277245dac8e04d5ec31d");
  }
  {
    const buff = new Uint8Array(32);
    buff[31] = buff[30] = buff[29] = buff[28] = 170;
    assertEq(hash("exposureReport", /** @const {!did.ExposureReport} */({
      id: hex(buff),
      signatureTs: 123123123123
    })), "0a9a3c0c8d1fa507641e0bab6d90adee12cb6a6efa544da55b5ca76b326f1740");
  }
}

const testSignSection = () => {
  /** @const {!did.HumanID} */
  const humanID1 = /** @type {!did.HumanID} */({
    id: "1234A234"
  })

  /** @const {!did.HumanID} */
  const humanID2 = /** @type {!did.HumanID} */({
    id: "1234A234",
    bls12_381: "asdfadsf",
    secp256k1: ["incorrect_sign"]
  })

  /** @const {string} */
  const commitmentR = base64([1, 2, 3]);
  /** @const {number} */
  const timestamp = ~~(Date.now() / 1000);
  signSection(
    "humanID", humanID1, commit(vm.addr(1n), commitmentR), timestamp, 11n);
  signSection(
    "humanID", humanID2, commit(vm.addr(1n), commitmentR), timestamp, 12n);

  // The owner attaches the commitmentR.
  delete humanID1.commitment;
  delete humanID2.commitment;
  humanID1.commitmentR = commitmentR;
  humanID2.commitmentR = commitmentR;

  assertEq(humanID1.secp256k1.length, 1);
  assertEq(humanID2.secp256k1.length, 1);
  assertEq(recoverSectionSigners("humanID", humanID1, vm.addr(1n))[0], vm.addr(11n));
  assertEq(recoverSectionSigners("humanID", humanID2, vm.addr(1n))[0], vm.addr(12n));

  humanID1.secp256k1.push(humanID2.secp256k1[0]);

  assertElemEq(recoverSectionSigners("humanID", humanID1, vm.addr(1n)),
    [vm.addr(11n), vm.addr(12n)]);

  humanID1.secp256k1.push(humanID2.secp256k1[0]);

  assertElemEq(recoverSectionSigners("humanID", humanID1, vm.addr(1n)),
    [vm.addr(11n), vm.addr(12n)]);
}

testHash();
testSignSection();

assertStats();
