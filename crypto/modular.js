/**
 * Modular inversion over F_P via the Euclidian algorithm.
 *
 * Requires that b < P and P is a prime.
 *
 * @param {!bigint} b
 * @param {!bigint} P
 * @return {!bigint} x such that Ax + Py = 1 and 0 < x < P.
 */
const inverse = (b, P) => {
    /** @type {!bigint} */
    let a = P;
    /** @type {!bigint} */
    let c = 0n;
    /** @type {!bigint} */
    let d = 1n;
    /** @type {!bigint} */
    let t;
    /** @type {!bigint} */
    let q;
    while (b !== 0n) {
        q = a / b;
        t = d; d = c - q * d; c = t;
        t = b; b = a - q * b; a = t;
    }
    if (c < 0) c += P;
    return c;
}

export { inverse };