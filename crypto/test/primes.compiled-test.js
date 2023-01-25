import { assertEq, assertStats } from "../../testing/assert";
import { millerRabin, getNonsmooth } from "../primes";

const testMillerRabin = () => {
  assertEq(millerRabin(37n, 9n, 2, [2n, 3n, 5n, 41n]), true);
  assertEq(millerRabin(41n, 10n, 2, [3n, 5n, 7n, 11n]), true);
  assertEq(millerRabin(17n, 1n, 4, [11n]), true);

  assertEq(millerRabin(33n, 1n, 5, [2n]), false);
  assertEq(millerRabin(15n, 7n, 1, [2n]), false);
}

const testGetNonsmooth = () => {
  assertEq(getNonsmooth("14c0657979dc9e9ee4efc484d3ebd0e1b9bac788baa47108d976c0a2c48e7"),
    BigInt("0x14c0657979dc9e9ee4efc484d3ebd0e1b9bac788baa47108d976c0a2c48e720f"));
}

testMillerRabin();
testGetNonsmooth();

assertStats();
