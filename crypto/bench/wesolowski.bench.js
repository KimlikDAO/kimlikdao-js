import { evaluate } from "/crypto/wesolowski";

console.time("evaluate()");

console.log(evaluate(Uint32Array.from("00000001"), 1 << 20));

console.timeEnd("evaluate()");
