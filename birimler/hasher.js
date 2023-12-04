import { createHash } from "crypto";
import { copyFile, open, readFile, } from "fs/promises";
import path from "path";
import process from "process";

/** @const {string} */
const mapFilePath = process.argv[2];
/** @const {!Array<string>} */
let args = process.argv.slice(3);

const mapFile = await open(mapFilePath, 'a+');
/** @type {boolean} */
let compress = true;

for (let fileName of args) {
  if (fileName == "--nocompress") {
    compress = false;
    continue;
  }

  const parts = path.parse(fileName);
  const hash = createHash('sha256')
    .update(await readFile(fileName))
    .digest()
    .toString("base64")
    .slice(0, 8)
    .replace("/", "+").replace("=", "-");
  /** @const {string} */
  const hashExtension = hash + parts.ext;

  await copyFile(fileName, 'build/' + hashExtension);

  if (compress)
    await Promise.all([
      copyFile(fileName + '.gz', 'build/' + hashExtension + '.gz'),
      copyFile(fileName + '.br', 'build/' + hashExtension + '.br')
    ]);

  if (parts.name.at(-3) === '-')
    fileName = `${parts.dir}/${parts.name.slice(0, -3)}${parts.ext}`;

  fileName = fileName.slice(5);
  console.log(fileName + " -> " + hashExtension);
  await mapFile.write(fileName + " -> " + hashExtension + "\n");
}

await mapFile.close();
