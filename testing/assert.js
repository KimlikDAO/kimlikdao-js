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

const assertEq = (value, expected) => {
  if (value != expected) {
    console.error(`Hata: beklenen ${expected}`);
    console.error(`       verilen ${value}`);
    FalseAsserts += 1;
  } else
    TrueAsserts += 1;
}

const assertSetEq = (value, expected) => {
  const expectSet = new Set(expected);
  if (value.length == expectSet.size && value.every((x) => expectSet.has(x))) {
    TrueAsserts += 1;
  } else {
    value.forEach((e) => {
      if (!expectSet.has(e)) console.log(`Hata: fazladan eleman ${e}`);
    });
    FalseAsserts += 1;
  }
}

const assertStats = () => {
  const color = FalseAsserts == 0 ? "\x1b[42m" : "\x1b[41m";
  console.log(`${color}${TrueAsserts} / ${TrueAsserts + FalseAsserts} assers true\x1b[0m`);
}

export {
  assert,
  assertEq,
  assertSetEq,
  assertStats,
};
