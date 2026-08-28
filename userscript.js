// ==UserScript==
// @name         Discord Test
// @namespace    https://example.com/
// @version      1.0
// @match        https://discord.com/*
// @grant        GM_setClipboard
// @grant        GM_download
// ==/UserScript==

(async function () {
  "use strict";

  let masterStructure = false;

  const fileInput = document.createElement("input");

  fileInput.type = "file";
  fileInput.accept = ".json,application/json";
  fileInput.style.display = "none";

  fileInput.style.position = "absolute";
  fileInput.style.top = "14px";
  fileInput.style.left = "50%";
  fileInput.style.transform = "translateX(-50%)";
  fileInput.style.width = "300px";
  fileInput.style.height = "50px";
  fileInput.style.zIndex = "999999999";
  fileInput.style.display = "block";

  fileInput.placeholder = "awaiting MasterStructure.json...";

  document.body.appendChild(fileInput);

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];

    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);

    masterStructure = data;

    document.body.removeChild(fileInput);
  });

  fileInput.click();

  document.addEventListener("dragstart", async (e) => {
    if (!masterStructure) {
      alert("Upload your MasterStructure.json first!");
      return;
    }
    let target = e.target;

    const parent =
      target.parentElement?.parentElement?.parentElement?.parentElement;
    const spans = parent?.querySelectorAll("span");

    const Difficulty = spans[2].innerHTML.toLowerCase().replace("\\n", "").trim();
    const Type = spans[4].innerHTML.toLowerCase().replace("\\n", "").trim();

    console.log("Diff", Difficulty, Type);
    const img = target.parentElement?.querySelectorAll("img")[0];

    if (!img) {
      console.log("No image found :(((((((");
      return;
    }

    console.log("img", img);

    const div = document.createElement("div");

    let easySelected;
    let mediumSelected;
    let hardSelected;
    let platformerSelected;

    const handleSelectEasy = () => {};
    const handleSelectMedium = () => {};
    const handleSelectHard = () => {};
    const handleSelect = () => {};

    div.innerHTML = `
            <div style="display: flex; flex-direction: column; position: absolute; top: 0; width: 300px; height: 50px; z-index: 9999999; margin-left: -150px; left: 50%; margin-top: 14px;">
                <input type="text" placeholder="Paste lvl name...">
            </div>
        `;

    document.body.appendChild(div);

    const input = div.querySelector("input");

    input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        const value = input.value;

        if (!(input.value.length > 0)) return;

        let formattedForFileName = value.replace(/ /g, "_") + ".webp";

        GM_download({
          url: img.src,
          name: formattedForFileName,
          saveAs: true,
          onerror: (error) => {
            alert("Image download failed:", error);
          },
        })

        masterStructure[Difficulty][Type][value.trim()] = {}

        const json = JSON.stringify(masterStructure, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        GM_download({
            url: url,
            name: "MasterStructure.json",
            saveAs: true,
            onerror: (error) => {
              alert("JSON download failed:", error);
            },
        });

        document.body.removeChild(div)
      }
    });

    //console.log(colors)
    //GM_setClipboard(JSON.stringify(colors));

    //GM_xmlhttpRequest({
    //method: "POST",
    //url: "http://localhost:5000/process",
    //headers: {
    //"Content-Type": "application/json"
    //},
    //data: JSON.stringify({
    //image: img.src
    //})
    //});
  });
})();
