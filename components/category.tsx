// WARNING:
// dogshit html below vvvvvv

const localStorageKey = "Spunky2"

import React, { useState } from "react";
import { readLocalStorage, writeLocalStorage } from '../lib/localStorage';
const response = await fetch(`${(import.meta as any).env.BASE_URL}MasterStructure.json`);
const everyLevel = await response.json();

function Category({ difficultyKey, hideLevels, clickedSpunky, allLevels, setAllLevels, selectedLevels, setSelectedLevels, useIgnoredLevels }: { hideLevels: boolean; useIgnoredLevels: boolean, difficultyKey: string, clickedSpunky: boolean, handleRestart?: any, selectedLevels: string[], setSelectedLevels: React.Dispatch<React.SetStateAction<string[]>>, allLevels: string[], setAllLevels: React.Dispatch<React.SetStateAction<any>> }) {
    const [openCategories, setOpenCategories] = useState<string[]>([])
    const [levelsToIgnore, setLevelsToIgnore] = useState<string[]>(readLocalStorage(localStorageKey) || []);

    const handleOpen = (typeKey: string) => {
      setOpenCategories([...openCategories, typeKey])

      let aggregate: string[] = []
      let aggregateObject: any = {}
      Object.keys(everyLevel[difficultyKey][typeKey]).filter((val) => levelsToIgnore.indexOf(val) === -1 || useIgnoredLevels).forEach(val => (aggregate.push(val), aggregateObject[val] = { difficulty: difficultyKey, type: typeKey } ))

      setAllLevels( {...allLevels, ...aggregateObject} )
      setSelectedLevels([...selectedLevels, ...aggregate])
    }

    const handleClose = (typeKey: string) => {
      setOpenCategories(openCategories.filter(item => item !== typeKey))

      let levelsToRemove = Object.keys(everyLevel[difficultyKey][typeKey])
      setSelectedLevels(selectedLevels.filter(val => levelsToRemove.indexOf(val) === -1))
    }

    const handleToggleIgnore = (levelName: string) => {
      if (useIgnoredLevels) return;

      if (levelsToIgnore.indexOf(levelName) === -1) {
        let newArray = [...levelsToIgnore, levelName];
        writeLocalStorage(localStorageKey, newArray);
        setLevelsToIgnore(newArray);
      } else {
        let newArray = levelsToIgnore.filter((a) => a !== levelName)
        writeLocalStorage(localStorageKey, newArray);
        setLevelsToIgnore(newArray);
      }
    }

  return (
    <div>
          {Object.keys(everyLevel[difficultyKey]).map(
            (typeKey) => {
              return <div className="bg-purple-600 flex text-white flex-row gap-4">
                <p className="w-20 cursor-pointer select-none" onClick={() => {
                  if (openCategories.indexOf(typeKey) !== -1) {
                    handleClose(typeKey)
                  } else handleOpen(typeKey)
                }}>{typeKey} <span className="text-xs">({Object.keys(everyLevel[difficultyKey][typeKey]).length})</span></p>
                <div className="flex flex-col">
                  {openCategories.indexOf(typeKey) !== -1 ? <div><button className="cursor-pointer select-none" onClick={() => handleClose(typeKey)}>^</button>{!hideLevels && Object.keys(everyLevel[difficultyKey][typeKey]).sort((a, b) => {const aIgnored = levelsToIgnore.includes(a);const bIgnored = levelsToIgnore.includes(b);if (aIgnored !== bIgnored && !useIgnoredLevels) {return Number(aIgnored) - Number(bIgnored);};return a.localeCompare(b);}).map(
                    (levelNameKey) => {
                      const inRotation = selectedLevels.indexOf(levelNameKey) !== -1;
                    return (<div style={{ color: inRotation ? "#ffffff" : "#ff7777"}}>
                      <button className="cursor-pointer select-none flex flex-col" onClick={() => (setSelectedLevels(selectedLevels.indexOf(levelNameKey) === -1 ? [...selectedLevels, levelNameKey] : selectedLevels.filter(val => val !== levelNameKey)), handleToggleIgnore(levelNameKey))}>{inRotation && <img className="w-24" src={`${(import.meta as any).env.BASE_URL}${clickedSpunky ? "le_jet_prive_a_tyty" : levelNameKey.replace(/ /g, "_")}.webp`}/>}<p className="pb-4 -mt-1">{clickedSpunky ? "le jet prive a tyty" : levelNameKey}</p></button>
                      </div>)}
                  )}</div> : <button className="cursor-pointer select-none" onClick={() => handleOpen(typeKey)}>v</button>}
                </div>
              </div>
            }
          )}
        </div>
  )
}

export default Category
