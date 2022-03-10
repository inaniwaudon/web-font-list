const fontList = [];
let fontNameInput,
  maxCountInput,
  onlyJapaneseInput,
  fontListUl,
  allSampleTextarea;

window.onload = () => {
  fontNameInput = document.querySelector("#font-name");
  maxCountInput = document.querySelector("#max-count");
  onlyJapaneseInput = document.querySelector("#only-japanese");
  fontListUl = document.querySelector("#font-list");
  allSampleTextarea = document.querySelector("#all-sample");

  loadFont();
};

const getFontType = (version) => {
  return ["\x00\x01\x00\x00", "true", "typ1"].includes(version)
    ? "TrueType"
    : version == "OTTO"
    ? "OpenType"
    : "undefined";
};

const japaneseRegex = /[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]/;

const loadFont = async () => {
  let fonts;
  try {
    // Query for allowed local fonts.
    fonts = await navigator.fonts.query();
  } catch {
    console.warn(`Local font access not available.`);
  }

  fontListUl.innerHTML = "";

  fonts
    .filter(
      (font) =>
        (fontNameInput.value.length === 0 ||
          font.fullName.indexOf(fontNameInput.value) > -1) &&
        japaneseRegex.test(font.fullName)
    )
    .slice(0, maxCountInput.value)
    .forEach(async (font) => {
      if (onlyJapaneseInput.checked || japaneseRegex.test(font.fullName)) {
        const sfnt = await font.blob();
        const version = await sfnt.slice(0, 4).text();

        const li = document.createElement("li");
        li.className = "font";
        li.innerHTML = `<h2>${font.fullName}</h2><p class="detail">PSName: ${
          font.postscriptName
        }<br/>${getFontType(version)}</p>`;
        fontListUl.appendChild(li);

        const sample = document.createElement("textarea");
        sample.className = "font__sample";
        sample.style.fontFamily = font.postscriptName;
        sample.innerHTML = allSampleTextarea.innerHTML;
        li.appendChild(sample);
      }
    });
};
