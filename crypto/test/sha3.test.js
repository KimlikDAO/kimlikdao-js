import { assert, describe, it } from 'vitest';
import { keccak256 } from '../sha3';

describe('keccak256 tests', () => {
  it('should output correct string value', () => {
    assert.equal(
      keccak256("a"),
      "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb"
    );
    assert.equal(
      keccak256("KimlikDAO"),
      "27f13dbab0f15a910e07f535a5e00d7fa9aeecc05edf81fc9191b482f5b8f07b"
    );
    assert.equal(
      keccak256("DAOKasasiV1"),
      "3f5e44c15812e7a9bd6973fd9e7c7da4afea4649390f7a1652d5b56caa8afeff"
    );
    assert.equal(
      keccak256("DAOKasasiV2"),
      "2d7821c610b81500eb7161a82514071bd27c2ea4bcd376b4e2641a3478f8227c"
    );
    assert.equal(
      keccak256("OylamaV1"),
      "2ebcd3dad633011bca307c5ca6ad84a8fac491a68c8a3104470dc58a85c91f53"
    );
    assert.equal(
      keccak256("OylamaV2"),
      "4290d6a1b6d740f23ccc384ba6018214b01666264bfbfbb57554a50d102a063f"
    );
  })
});
