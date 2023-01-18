/** @const {!bigint} */
const N = BigInt("0x"
  + "C253979CA261FDA89C249E3ADF2B76B94AF50B3C6FD049A99398C927DF751A38"
  + "AE8BEF2C3FC22ADF1899688ECA48CF8412E143D3CFC42C8E8ED36DEA130FEA06"
  + "9CD3E4B6D9797A1C71BFBF02C13319466A429FA8C2E016B12A049F8510364BA3"
  + "4F150A053A25402B00B6F983E9F270042C7648C18F362293539FD0F7BFD8E07E");

/**
 * @param {!bigint} x
 * @param {number} t
 * @return {{
 *   y: !bigint,
 *   π: !bigint,
 *   l: !bigint
 * }}
 */
const evaluate = (x, t) => {
  let y = x;
  for (let i = 0; i < t; ++i)
    y = y * y % N;

  return { y, π: 0n, l: 0n }
}

const verify = (π) => { }

export { evaluate, verify };
