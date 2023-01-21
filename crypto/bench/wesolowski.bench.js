import { evaluate } from "/crypto/wesolowski";

console.time("a");

console.log(evaluate(2n, 1 << 22));

console.timeEnd("a");
