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

const assertStats = () => {
  const color = FalseAsserts == 0 ? "\x1b[42m" : "\x1b[41m";
  console.log(`${color}${TrueAsserts} / ${TrueAsserts + FalseAsserts} assers true\x1b[0m`);
}

export {
  assert,
  assertStats,
};
