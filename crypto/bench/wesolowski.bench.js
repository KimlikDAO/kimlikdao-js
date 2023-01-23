import { evaluate } from "/crypto/wesolowski";

console.time("evaluate()");

console.log(evaluate(2n, 1 << 20));

console.timeEnd("evaluate()");
