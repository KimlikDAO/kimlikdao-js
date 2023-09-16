import { G } from "/crypto/secp256k1";
import { assertEq } from "/testing/assert";

const testNobleVectors = () => readFile("crypto/test/secp256k1/nobleVectors.txt", "utf8")
  .then((/** string */ vectors) => {
    /** @const {!Array<!Array<number>>} */
    const tuples = vectors.split("\n")
      .filter((line) => line)
      .map((line) => line.split(":"))

    for (const [priv, xHex, yHex] of tuples) {
      const { x, y } = G.copy().multiply(BigInt(priv)).project();
      assertEq(x, BigInt("0x" + xHex));
      assertEq(y, BigInt("0x" + yHex));
    }
  });

testNobleVectors();
