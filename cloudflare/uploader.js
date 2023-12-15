import { readFileSync, readdirSync } from "fs";
import toml from "toml";
import { base64 } from "../util/çevir.js";

/** @const */
const CfConfig = toml.parse(readFileSync(process.argv[2], "utf-8"));
/** @const {string} */
const Route = `https://${CfConfig.route.pattern}/`;
/** @const {string} */
const AccountId = CfConfig.account_id;
/** @const {string} */
const ZoneId = CfConfig.zone_id;
/** @const {string} */
const NamespaceId = CfConfig.kv_namespaces[0].id;
/** @const {string} */
const CfUploaderToken = toml.parse(readFileSync('.gizli', 'utf-8')).CF_UPLOADER_TOKEN;

/** @const {string} */
const Url = 'https://api.cloudflare.com/client/v4';
/** @const {string} */
const AccountsUrl = `${Url}/accounts/${AccountId}/storage/kv/namespaces/${NamespaceId}/`;
/** @const {string} */
const ZonesUrl = `${Url}/zones/${ZoneId}/`;

/**
 * Reads variables from a file.
 *
 * @param {string} prefix
 * @param {string} filePath
 * @return {!Array<string>}
 */
const readVariable = (prefix, filePath) => {
  /** @const {!Array<string>} */
  const lines = readFileSync(filePath, 'utf-8').split('\n');
  for (let line of lines)
    if (line.startsWith(prefix))
      return line.slice(prefix.length).trim().split(' ');

  console.log(`${prefix} bulunamadı`);
  return [];
};

/** @const {!Array<string>} */
const Sayfalar = readVariable('PAGES :=', process.argv[3]);
/** @const {!Array<string>} */
const NamedAssets = readVariable('NAMED_ASSETS :=', process.argv[3]);

/**
 * Splits an array into chunks.
 *
 * @template T
 * @param {!Array<T>} arr
 * @param {number} n
 * @return {!Array<!Array<T>>}
 */
const chunks = (arr, n) => {
  /** @const {!Array<!Array<T>>} */
  const result = [];
  for (let i = 0; i < arr.length; i += n)
    result.push(arr.slice(i, i + n));
  return result;
};

/**
 * Gets existing keys from CloudFlare KV.
 *
 * @return {!Promise<!Set<string>>}
 */
const getExisting = () =>
  fetch(AccountsUrl + 'keys', {
    headers: { 'Authorization': 'Bearer ' + CfUploaderToken }
  }).then((res) => res.json())
    .then((data) => new Set(data.result.map(x => x.name)))

/**
 * Batch uploads assets.
 *
 * @param {!Array<string>} names
 * @return {!Promise<*>}
 */
const batchUpload = (names) => {
  const toUpload = names.map(name => ({
    key: name,
    value: base64(readFileSync('build/' + name)),
    base64: true
  }));

  return fetch(AccountsUrl + 'bulk', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CfUploaderToken
    },
    body: JSON.stringify(toUpload)
  }).then((res) => res.json());
};

/**
 * Purges the CloudFlare cache.
 *
 * @param {!Array<string>} assets
 * @return {!Promise<void>}
 */
const purgeCache = async (assets) => {
  /** @const {!Array<!Array<string>>} */
  const batches = chunks(assets, 20);
  for (let i = 0; i < batches.length; i++) {
    /** @const {string} */
    const body = JSON.stringify({ files: batches[i].map(asset => Route + asset) });
    /** @const {!Response} */
    const res = await fetch(ZonesUrl + 'purge_cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + CfUploaderToken
      },
      body
    });
    console.log(`  - Batch ${i} result: ${res.status}`);
  }
};

/** @const {!Array<string>} */
const Dil = ['en', 'tr'];
/** @const {!Array<string>} */
const Ext = ['', '.br', '.gz'];

/** @const {!Array<string>} */
const existing = await getExisting();

/** @const {!Array<string>} */
const namedUpload = [
  ...Sayfalar.flatMap((sayfa) => Dil.flatMap((d) => Ext.map((e) => `${sayfa}-${d}.html${e}`))),
  ...NamedAssets.flatMap((named) => Ext.map(e => named + e))
];
/** @const {!Set<string>} */
const namedUploadSet = new Set(namedUpload);

/** @const {!Array<string>} */
const staticUpload = readdirSync("build", { withFileTypes: true })
  .filter((file) => file.isFile() && !existing.has(file.name) && !namedUploadSet.has(file.name))
  .map((file) => file.name);

// (1) Statik asset'leri yükle
if (staticUpload.length > 0) {
  console.log("🌀 Statik asset'ler yükleniyor", staticUpload);
  await batchUpload(staticUpload);
} else
  console.log("✅ Statik asset'ler aynı, bu adım atlanıyor");

// (2) Named asset'leri yükle
console.log("🌀 Named asset'ler yükleniyor", namedUpload);
await batchUpload(namedUpload);

// (3) Cache purge et
console.log("🌀 Cache purge ediliyor");
await purgeCache(namedUpload);
