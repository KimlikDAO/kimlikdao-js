
import ipfs from "/node/ipfs";
import { assertEq, assertStats } from "/testing/assert";

const testCID = async () => {
  /** @const {!Uint8Array} */
  const file1 = new TextEncoder().encode("a".repeat(2680));
  /** @const {!Uint8Array} */
  const hash = (await ipfs.hash(file1)) || new Uint8Array(0);
  assertEq(
    ipfs.CID(hash),
    "Qmawd3DRAY5YwtCzQe8gBumMXA1JCrzvbH2WQR6ZTykVoG"
  );

  assertStats();
}

testCID();
