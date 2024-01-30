import { ChainId } from "/crosschain/chains";
import TCKT from "/ethereum/TCKT";
import { assertEq } from "/testing/assert";

assertEq(TCKT.isTokenAvailable(ChainId.xa86a, 1), true);
assertEq(TCKT.isTokenAvailable(ChainId.x406, 1), false);

assertEq(TCKT.isTokenERC20Permit(ChainId.x1, 1), false);
assertEq(TCKT.isTokenERC20Permit(ChainId.x1, 2), true);
assertEq(TCKT.isTokenERC20Permit(ChainId.xa86a, 1), true);
assertEq(TCKT.isTokenERC20Permit(ChainId.x406, 1), false);
