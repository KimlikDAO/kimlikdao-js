import { evaluate } from "/crypto/wesolowski";

console.time("a");

console.log(evaluate(2n, 5_000_000));

console.timeEnd("a");
