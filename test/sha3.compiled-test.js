import { keccak256 } from '../sha3';
import { keccak256 as keccak256_orig } from './sha3_orig';
import { keccak256 as keccak256_prev } from './sha3_prev';

let TrueAsserts = 0;
let FalseAsserts = 0;

const assert = (value) => {
  if (!value) {
    console.error("Hata");
    FalseAsserts += 1;
  } else
    TrueAsserts += 1;
  return value;
}

assert(
  keccak256("a") ==
  "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb"
);

assert(
  keccak256("KimlikDAO") ==
  "27f13dbab0f15a910e07f535a5e00d7fa9aeecc05edf81fc9191b482f5b8f07b"
);

assert(
  keccak256("Deneme") ==
  "62592aae22a4f32153836d2a5dccaf6995695fc0a15301b8b306d46aeb316f32"
);

assert(
  keccak256("") ==
  "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
);

assert(
  keccak256("3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb".repeat(10)) ==
  "1d22484fbe32dff99e456dbca27b22db2c4c7d006cbc1addc58e08903aee785b"
);

assert(
  keccak256("KimlikDAO".repeat(64)) ==
  "a5b68ade127ab4046c0555468bb3b1553f47ce6df2831b5d17e7ed27501cda51"
);

for (let i = 0; i < 5000; ++i) {
  let test = "abracadabra".repeat(i);
  const ours = keccak256(test);
  const prev = keccak256_prev(test);
  const orig = keccak256_orig(test);
  assert(ours == prev);
  assert(ours == orig)
}

for (let i = 0; i < 5000; ++i) {
  let test = "c".repeat(i);
  const ours = keccak256(test);
  const prev = keccak256_prev(test);
  const orig = keccak256_orig(test);
  assert(ours == prev);
  assert(ours == orig)
}

const color = FalseAsserts == 0 ? "\x1b[42m" : "\x1b[41m";
console.log(`${color}${TrueAsserts} / ${TrueAsserts + FalseAsserts} assers true\x1b[0m`);

{
  console.time("1k keccak256_orig");
  let c = 0;
  for (let i = 0; i < 5000; ++i)
    c += parseInt(keccak256_orig("z".repeat(i))[0], 16);
  console.log(c);
  console.timeEnd("1k keccak256_orig");
}
{
  console.time("1k keccak256_prev");
  let c = 0;
  for (let i = 0; i < 5000; ++i)
    c += parseInt(keccak256_prev("z".repeat(i))[0], 16);
  console.log(c);
  console.timeEnd("1k keccak256_prev");
}
{
  console.time("1k keccak256");
  let c = 0;
  for (let i = 0; i < 5000; ++i)
    c += parseInt(keccak256("z".repeat(i))[0], 16);
  console.log(c);
  console.timeEnd("1k keccak256");
}
