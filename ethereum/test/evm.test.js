import { assert, describe, it } from 'vitest';
import evm from '../evm';

describe('adresDüzelt tests', () => {
  it('Should add checksum to lower case address', () => {
    assert.equal(
      evm.adresDüzelt("0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"),
      "0x79883D9aCBc4aBac6d2d216693F66FcC5A0BcBC1"
    );
  })

  it('Should add checksum to upper case address', () => {
    assert.equal(
      evm.adresDüzelt("0x" + "79883d9acbc4abac6d2d216693f66fcc5a0bcbc1".toUpperCase()),
      "0x79883D9aCBc4aBac6d2d216693F66FcC5A0BcBC1"
    );
  })

  it('Should reject malformed checksum', () => {
    assert.equal(
      evm.adresDüzelt("0x79883D9acbc4abac6d2d216693f66fcc5a0bcbc1"),
      null
    );
    assert.equal(
      evm.adresDüzelt("0x79883d9acbc4abac6d2d216693f66fcc5a0bcbC1"),
      null
    );
  })
})

describe('adresGeçerli tests', () => {
  it('Should accept valid', () => {
    assert(
      evm.adresGeçerli("0x79883D9aCBc4aBac6d2d216693F66FcC5A0BcBC1")
    );
  })

  it('Should reject invalid', () => {
    assert.isFalse(
      evm.adresGeçerli("0x79883D9acbc4aBac6d2d216693F66FcC5A0BcBC1")
    );
  })
});
