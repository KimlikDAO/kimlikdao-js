import TCKT from "/ethereum/TCKT";
import { assertEq, assertStats } from "/testing/assert";

assertEq(TCKT.isTokenAvailable("0xa86a", 1), true);
assertEq(TCKT.isTokenAvailable("0x406", 1), false);

assertEq(TCKT.isTokenERC20Permit("0x1", 1), false);
assertEq(TCKT.isTokenERC20Permit("0x1", 2), true);
assertEq(TCKT.isTokenERC20Permit("0xa86a", 1), true);
assertEq(TCKT.isTokenERC20Permit("0x406", 1), false);

assertStats();
