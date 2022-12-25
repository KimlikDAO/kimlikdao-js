
import ipfs from "/node/ipfs";
import { assertEq, assertStats } from "/testing/assert";

const testCID = async () => {
  /** @const {TextEncoder} */
  const encoder = new TextEncoder();

  assertEq(
    ipfs.CID(/** @type {!Uint8Array} */(
      await ipfs.hash(encoder.encode("a".repeat(2680))))),
    "Qmawd3DRAY5YwtCzQe8gBumMXA1JCrzvbH2WQR6ZTykVoG"
  );

  assertEq(
    ipfs.CID(/** @type {!Uint8Array} */(
      await ipfs.hash(encoder.encode("KimlikDAO\n")))),
    "QmafCiqeYQtiXokAEUB4ToMcZJREhJcShbzvjrYmC1WCsi"
  );

  assertEq(
    ipfs.CID(/** @type {!Uint8Array} */(
      await ipfs.hash(encoder.encode("foo\n")))),
    "QmYNmQKp6SuaVrpgWRsPTgCQCnpxUYGq76YEKBXuj2N4H6"
  );

  assertEq(
    ipfs.CID(/** @type {!Uint8Array} */(
      await ipfs.hash(encoder.encode("a".repeat(31337))))),
    "Qmbq6rxwg5uKYAEhdFvPnBqzbJWAPfhB4LwF4yGamvzWSR"
  );

  assertStats();
}

testCID();
