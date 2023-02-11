import { ethers } from "ethers";
import { assert, describe, it } from "vitest";
import { TokenData, TokenInfo } from '../TCKT';

/**
 * @param {!TokenInfo} tokenInfo
 */
const checkDomainSeparator = (tokenInfo, chainId, domainSeparator) => {
  assert.equal(
    ethers.TypedDataEncoder.hashDomain({
      name: tokenInfo.uzunAd,
      version: "" + tokenInfo.sürüm,
      chainId,
      verifyingContract: tokenInfo.adres
    }),
    domainSeparator
  );
}

describe('0xa86a DOMAIN_SEPARATOR() check', () => {
  it('should be equal to the on-chain DOMAIN_SEPARATOR()', () => {
    checkDomainSeparator(TokenData["0xa86a"][1], "0xa86a",
      "0xf6d4d20bf85d69d29f5cd682e5fb2884425e4aa291bb7318e203fd68c96cc0f4");

    checkDomainSeparator(TokenData["0xa86a"][2], "0xa86a",
      "0xbbea200329a938bc3438984a49cb0732e66d66d7bd59c127abacc1710e77f7b3");

    checkDomainSeparator(TokenData["0xa86a"][3], "0xa86a",
      "0x039e8aca8365b03d156cc819454c50146e9ad567b9929912528d9f270de1117a");

    checkDomainSeparator(TokenData["0xa86a"][4], "0xa86a",
      "0x7aabf5cc18d2bfe04aad7008a1e76f13101e3abc2c9181cc5afa93a99bc71cb8");
  })
});
