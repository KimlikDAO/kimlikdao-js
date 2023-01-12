/**
 * @define {boolean}
 */
const TR = true;

/**
 * @noinline
 * @param {string} ad DOM biriminin adı.
 * @return {Element}
 */
const adla = (ad) => document.getElementById(ad);

/**
 * @noinline
 * @param {Element} birim
 */
const gizle = (birim) => birim.style.display = "none";

/**
 * @noinline
 * @param {Element} birim
 */
const göster = (birim) => birim.style.display = "";

/**
 * @noinline
 * @param {string} ad
 */
const adlaGizle = (ad) => adla(ad).style.display = "none";

/**
 * @noinline
 * @param {string} ad
 */
const adlaGöster = (ad) => adla(ad).style.display = "";

/**
 * @param {Element} buton Durdurulacak düğme.
 */
const butonDurdur = (buton) => {
  buton.onclick = null;
  buton.disabled = true;
  buton.classList.add("dis");
}

/**
 * @param {Element} düğme
 * @param {Element} menü
 */
const menüYarat = (düğme, menü) => {
  const kapat = (event) => {
    düğme.classList.remove("sel");
    gizle(menü);
    window.onclick = null;
  }
  düğme.onclick = (event) => {
    düğme.classList.add("sel");
    menü.style.display = "";
    let f = window.onclick;
    if (f) f(event);
    if (f !== kapat) window.onclick = kapat;
    event.stopPropagation();
  }
}

/**
 * @param {number} para
 * @return {string} metin olarak yazılmış para miktarı
 */
const paradanMetne = (para) => TR
  ? ("" + (para / 1_000_000)).replace(".", ",")
  : ("" + (para / 1_000_000))

/**
 * @param {string} telefon
 * @return {string} formatlanmış telefon numarası
 */
const telefondanMetne = (telefon) =>
  telefon.slice(0, 3) + " (" + telefon.slice(3, 6) + ") " + telefon.slice(6, 9) + " " +
  telefon.slice(9, 11) + " " + telefon.slice(11);

export default {
  adla,
  adlaGizle,
  adlaGöster,
  butonDurdur,
  gizle,
  göster,
  menüYarat,
  paradanMetne,
  telefondanMetne,
  TR,
};
