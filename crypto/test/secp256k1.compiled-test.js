import { assert } from "../../testing/assert";
import { G, Point } from "../secp256k1"

const equal = (p, q) => {
    q.normalize();
    p.normalize();
    return p.x == q.x && p.y == q.y;
}


const iG = G.copy();
const dG = G.copy();
assert(equal(iG, G));
assert(equal(dG, G));
assert(equal(dG, iG));

iG.increment(iG);
iG.normalize();

dG.double();
dG.normalize();

assert(equal(iG, dG));


const i2G = G.copy();
const d2G = G.copy();
const zG = G.copy();

i2G.double();
i2G.increment(i2G);
i2G.normalize();

d2G.increment(zG);
d2G.increment(zG);
d2G.increment(zG);
d2G.normalize();

assert(equal(i2G, d2G))


const i3G = G.copy();
const expectedI = new Point(89565891926547004231252920425935692360644145829622209833684329913297188986597n, 12158399299693830322967808612713398636155367887041628176798871954788371653930n, 1n)

i3G.increment(new Point(0n, 0n, 0n))
i3G.normalize();
assert(equal(i3G, expectedI))

const x3G = G.copy();
const expectedX = new Point(59636437674436018540602615641686032862157707168289197592967850648654366808804n, 30033449554395615947420350413322077732031610828073260370961671951161707416417n, 1n)
for (let i = 0; i < 10000; ++i) {
    x3G.double()
}
x3G.normalize();
assert(equal(x3G, expectedX))