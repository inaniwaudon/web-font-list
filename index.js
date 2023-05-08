const fontList = [];
let fontNameInput,
  maxCountInput,
  onlyJapaneseInput,
  fontListUl,
  allSampleTextarea,
  initializeDiv;

window.onload = () => {
  fontNameInput = document.querySelector("#font-name");
  maxCountInput = document.querySelector("#max-count");
  onlyJapaneseInput = document.querySelector("#only-japanese");
  fontListUl = document.querySelector("#font-list");
  allSampleTextarea = document.querySelector("#all-sample");
  initializeDiv = document.querySelector("#initialize");
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
    fonts = await self.queryLocalFonts();
  } catch (e) {
    alert("ローカルのフォント読み込みを利用できませんでした。\n" + e);
    return;
  }

  initializeDiv.style.display = "none";
  fontListUl.innerHTML = "";

  fonts
    .filter(
      (font) =>
        (fontNameInput.value.length === 0 ||
          font.fullName.indexOf(fontNameInput.value) > -1) &&
        (!onlyJapaneseInput.checked || japaneseRegex.test(font.fullName))
    )
    .slice(0, maxCountInput.value)
    .forEach(async (font) => {
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
      sample.innerHTML = allSampleTextarea.value;
      li.appendChild(sample);
    });
};
