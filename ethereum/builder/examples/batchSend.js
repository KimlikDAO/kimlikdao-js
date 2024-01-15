import { EVM } from "@ethereumjs/evm";
import { JsonRpcProvider, Wallet } from "ethers";
import { hex } from "../../../util/çevir";
import { ByteCode, SZABO, batchSendFixedAmount } from "../builder";

const simulate = async (program) => {
  const evm = new EVM();

  evm.events.on("step", (data) => {
    console.log("memory:\t", data.memory);
    console.log("stack:\t", data.stack);
    console.log(data.opcode.name);
  })
  const results = await evm.runCode({ data: program, code: program });
  console.log("Gas used", results.executionGasUsed);
}

/**
 * @const
 * @type {!ByteCode}
 */
const batchSend = batchSendFixedAmount([
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222",
  "0x3333333333333333333333333333333333333333",
  "0x4444444444444444444444444444444444444444",
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "0xcccccccccccccccccccccccccccccccccccccccc",
  "0xdddddddddddddddddddddddddddddddddddddddd",
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0xffffffffffffffffffffffffffffffffffffffff",
], 1_000);

/**
 * @param {!ByteCode} program
 */
const send = async (program) => {
  /**
   * @const
   * @type {!Provider}
   */
  const provider = new JsonRpcProvider("https://goerli.drpc.org/");
  /** @const {!Wallet} */
  const wallet = new Wallet(process.argv[2], provider);

  const res = await wallet.estimateGas({
    value: 10_000n * SZABO,
    data: "0x" + hex(program),
  });

  console.log(res);
}

send(batchSend);
