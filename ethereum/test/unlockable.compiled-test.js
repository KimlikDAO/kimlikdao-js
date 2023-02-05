import { decrypt, encrypt } from "/ethereum/unlockable";
import { assertEq, assertStats } from "/testing/assert";
import vm, { FakeProvider } from "/testing/vm";

/**
 * @return {!Promise<boolean>}
 */
const testEncryptDecryptSmall = () => {
  /** @const {!bigint} */
  const privKey = 0x1337ACCn;
  /** @const {!FakeProvider} */
  const provider = new FakeProvider(privKey);
  /** @const {string} */
  const text = "Text to encrypt";
  return encrypt(
    text,
    "Sign to encrypt this text",
    "promptsign-sha256-aes-ctr",
    provider,
    vm.addr(privKey)
  )
    .then((unlockable) =>
      decrypt(unlockable, provider, provider.getAddress()))
    .then((/** @type {string} */ decrypted) => assertEq(decrypted, text));
}

/**
 * @return {!Promise<boolean>}
 */
const testEncryptDecryptLarge = () => {
  /** @const {!bigint} */
  const privKey = 0x1337ADD3n;
  /** @const {!FakeProvider} */
  const provider = new FakeProvider(privKey);
  /** @const {string} */
  const text = "Text to encrypt".repeat(1000);
  return encrypt(
    text,
    "Sign to encrypt this long ah text",
    "promptsign-sha256-aes-ctr",
    provider,
    vm.addr(privKey)
  )
    .then((unlockable) =>
      decrypt(unlockable, provider, provider.getAddress()))
    .then((/** @type {string} */ decrypted) => assertEq(decrypted, text));
}

Promise.all([
  testEncryptDecryptSmall(),
  testEncryptDecryptLarge(),
])
  .then(assertStats);
