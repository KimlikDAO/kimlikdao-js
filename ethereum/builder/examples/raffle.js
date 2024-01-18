import { JsonRpcProvider, TransactionResponse, Wallet } from "ethers";
import { shuffle } from "../../../util/arrays";
import { hex } from "../../../util/çevir";
import { Address, ByteCode, batchSendFixedAmountNoPush0 } from "../builder";
import { simulate } from "../simulator";

/**
 * @see https://twitter.com/szaglam/status/1747956442248671703
 *
 * @const
 * @type {!Array<!Address>}
 */
const Addys = Array.from(new Set([
  "0xFAE7b13B8D653E2D603Bf63950F37E1b23eCf148",
  "0xbe4a88460ce03492ff55c0eed016dd2536b9fda2",
  "0x218ee4d9F2598f6b0deA19899B859163416E8499",
  "0x5304eA777B594AFEa13717cf625E96263Cb86066",
  "0xF1FD2aa4967180d425023d91D2CdC77662b66248",
  "0x3057C40FcAF61A8E908F74C7a25cF12226A1B46D",
  "0x4912b34f6d811f49ab516bf1d7caa28c14f22ce7",
  "0x903CC03737CBA17C2D60CdA7d3Eb3a5Fb0AfaCa7",
  "0xC34E4E5C3DC4544556902cb44A916f0761087b3D",
  "0xbC8Ae4Be25e557cC1A4B0102b01cF4A61339E7a3",
  "0x5B7bD5305f7EC4beD2b9321117c54ed4c4c179E9",
  "0xe6Cf14A1DE1874B0cc7aFD6d3b1036d66a3B8376",
  "0xF6369D2285f4ca136bde23BfA60bc3A8B3E7f593",
  "0x479F37f12459810c2309AB95D3E14bbA340B1021",
  "0x636365C3e4d249ef15fCa3502a677f720720a904",
  "0xA9DcE14829993110573a47c10D6f7502967cA577",
  "0x766b3a974A296990E5d7FDe6EBD88befa69754d5",
  "0x1934DB048920332bAC5c4011B887Ac5FD7615eCb",
  "0x479F37f12459810c2309AB95D3E14bbA340B1021",
]));

/**
 * @const
 * @type {!ByteCode}
 */
const byteCode = batchSendFixedAmountNoPush0(
  shuffle(Addys).slice(0, 16), 16_000);

/**
 * @param {!ByteCode} program
 * @return {!Promise<!TransactionResponse>}
 */
const send = (program) => {
  /**
   * @const
   * @type {!Provider}
   */
  const provider = new JsonRpcProvider("https://rpcapi.fantom.network");
  /** @const {!Wallet} */
  const wallet = new Wallet(process.argv[2], provider);

  return wallet.sendTransaction({
    value: 256_000n * SZABO,
    data: "0x" + hex(program),
  });
}

simulate(byteCode);
// send(byteCode).then(console.log);
