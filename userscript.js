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

  let selectedLevelDiv;
  let selectedInput;

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

  fileInput.placeholder = "awaiting MasterStructure.json";

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

    if (Difficulty === "easy" || Difficulty === "medium" || Difficulty === "hard") {
      if (Type === "classic" || Type === "platformer") {
      } else {
        alert("Image must be selected from a real Sparky game")
        return;
      }
    } else {
        alert("Image must be selected from a real Sparky game")
        return;
    }

    const img = target.parentElement?.querySelectorAll("img")[0];

    if (!img) {
      console.log("No image found :(((((((");
      return;
    }

    if (selectedLevelDiv) {
      document.body.removeChild(selectedLevelDiv)
    }

    selectedLevelDiv = document.createElement("div");

    selectedLevelDiv.innerHTML = `
            <div style="display: flex; flex-direction: column; position: fixed; top: 0; width: 300px; height: 50px; z-index: 999999999999999999; margin-left: -150px; left: 50%; margin-top: 14px;">
                <input style="position: relative; z-index: 99999999999999999999; pointer-events: auto;" type="text" placeholder="Paste lvl name...">
            </div>
        `;

    document.body.appendChild(selectedLevelDiv);

    if (selectedInput) document.removeChild(selectedInput)

    const selectedInput = selectedLevelDiv.querySelector("input");

    document.addEventListener("keydown", async (e) => {
        e.stopImmediatePropagation();

        selectedInput.focus();

        if (e.key === "Enter") {
          const value = selectedInput.value;

          if (!(selectedInput.value.length > 0)) return;

          if (masterStructure[Difficulty][Type][value.trim()]) {
            document.body.removeChild(selectedLevelDiv)
            const alreadyHaveMessage = document.createElement("div");

            alreadyHaveMessage.innerHTML = `
                    <div style="color: #ff0000; display: flex; flex-direction: column; position: absolute; top: 0; width: 300px; height: 50px; z-index: 9999999; margin-left: -150px; left: 50%; margin-top: 14px;">
                        Level already collected
                    </div>
                `;

            document.body.appendChild(alreadyHaveMessage);

            await new Promise(resolve => setTimeout(resolve, 1000));

            document.body.removeChild(alreadyHaveMessage)

            return;
          }

          let formattedForFileName = value.replace(/ /g, "_") + ".webp";

          GM_download({
            url: img.src,
            name: formattedForFileName,
            saveAs: true,
            onerror: (error) => {
              alert("Image download failed: " + error);
            },
          })

          const previousVersion = structuredClone(masterStructure)
          masterStructure[Difficulty][Type][value.trim()] = {}

          const json = JSON.stringify(masterStructure, null, 2);
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          GM_download({
              url: url,
              name: "MasterStructure.json",
              saveAs: true,
              onerror: (error) => {
                alert("JSON download failed: " + error);
                masterStructure = { ...previousVersion }
              },
          });

          document.body.removeChild(selectedLevelDiv)
        }
    }, true);

    selectedInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        const value = selectedInput.value;

        if (!(selectedInput.value.length > 0)) return;

        if (masterStructure[Difficulty][Type][value.trim()]) {
          document.body.removeChild(selectedLevelDiv)
          const alreadyHaveMessage = document.createElement("div");

          alreadyHaveMessage.innerHTML = `
                  <div style="color: #ff0000; display: flex; flex-direction: column; position: absolute; top: 0; width: 300px; height: 50px; z-index: 9999999; margin-left: -150px; left: 50%; margin-top: 14px;">
                      Level already collected
                  </div>
              `;

          document.body.appendChild(alreadyHaveMessage);

          await new Promise(resolve => setTimeout(resolve, 1000));

          document.body.removeChild(alreadyHaveMessage)

          return;
        }

        let formattedForFileName = value.replace(/ /g, "_") + ".webp";

        GM_download({
          url: img.src,
          name: formattedForFileName,
          saveAs: true,
          onerror: (error) => {
            alert("Image download failed: " + error);
          },
        })

        const previousVersion = structuredClone(masterStructure)
        masterStructure[Difficulty][Type][value.trim()] = {}

        const json = JSON.stringify(masterStructure, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        GM_download({
            url: url,
            name: "MasterStructure.json",
            saveAs: true,
            onerror: (error) => {
              alert("JSON download failed: " + error);
              masterStructure = { ...previousVersion }
            },
        });

        document.body.removeChild(selectedLevelDiv)
      }
    });
  });
})();
