// WARNING:
// dogshit html below vvvvvv


import { useState, useEffect, useRef } from "react";
import Category from '../components/category';
import packageJson from "../package.json";
const response = await fetch(`${import.meta.env.BASE_URL}MasterStructure.json`);
const everyLevel = await response.json();

function randomNumber(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

function App() {
  const [allLevels, setAllLevels] = useState<any>()
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState<string>("");
  const [answerRevealed, setAnswerRevealed] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState<number>(0);
  const [streakLevels, setStreakLevels] = useState<string[]>([]);
  const [image, setImage] = useState<any>();
  const [clickedSpunky, setClickedSpunky] = useState<boolean>(false);
  const [useIgnoredLevels, setUseIgnoredLevels] = useState<boolean>(false);
  const [hideLevels, setHideLevels] = useState<boolean>(false);
  const [showLevelsNotInStreak, setShowLevelsNotInStreak] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { // cred chatgpt for these useEffects
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Don't steal focus if already typing somewhere
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Only focus when they actually type a character
      if (e.key.length === 1) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleStartGame = () => {
    const index = randomNumber(selectedLevels.length - 1)
    let newLevel = selectedLevels[index]
    setCurrentLevel(selectedLevels[index])
    setImage(null);

    const img = new Image();

    img.src = `${import.meta.env.BASE_URL}${newLevel.replace(/ /g, "_")}.webp`;

    img.onload = () => {
      setImage(
        <img
          src={img.src}
          alt=""
        />
      );
    };
  }

  const handleRestart = (increaseStreak?: boolean, forceLevel?: string) => {
    setAnswerRevealed(false)
    setInput("");
    let level = currentLevel;
    while (level === currentLevel && selectedLevels.length !== 1){
      level = selectedLevels[randomNumber(selectedLevels.length - 1)]
    }
    if (forceLevel) {
      setCurrentLevel(forceLevel)
    } else setCurrentLevel(level)

    if (increaseStreak) {
      if (streakLevels.indexOf(currentLevel) === -1) {
        setStreakLevels([...streakLevels, currentLevel])
      }
      setStreak(streak + 1)
    } else  {
      setStreakLevels([])
      setStreak(0)
    }

    setImage(null);

    const img = new Image();

    img.src = `${import.meta.env.BASE_URL}${(forceLevel || level).replace(/ /g, "_")}.webp`;

    img.onload = () => {
      setImage(
        <img
          src={img.src}
          alt=""
        />
      );
    };
  }

  const handleGuessLevel = (input: string) => { // allows duplicate level names if you put a space at the end of the file name
    if (input.toLowerCase().trim() === currentLevel.toLowerCase().trim()) {
      setInput("")
      if (streakLevels.indexOf(input) === -1) {
        setStreakLevels([...streakLevels, input])
      }
      setStreak(streak + 1)
      handleRestart(true)
    } else {
      setInput("")
    }
  }

  return (
    <main className="min-h-screen w-screen flex flex-row bg-[#232328] text-slate-100">
      <div className="w-1/2 md:w-1/3 max-h-screen overflow-y-auto">
      <div className="flex flex-row gap-8 text-xs p-2">
        <div className="flex flex-row gap-2 ml-28">
        <input onClick={() => setUseIgnoredLevels(!useIgnoredLevels)} name="Use all levels" title="Use ignored levels" type="checkbox" />
        Use ignored levels
        </div>
        <div className="flex flex-row gap-2">
        <input onClick={() => setShowLevelsNotInStreak(!showLevelsNotInStreak)} name="Show levels not in streak" title="Show levels not in streak" type="checkbox" />
        Show levels not in streak
        </div>
        <div className="absolute top-0 flex flex-row gap-2 p-2">
        <input onClick={() => setHideLevels(!hideLevels)} name="Hide levels" title="Hide levels" type="checkbox" />
        Hide levels
        </div>
      </div>
      {showLevelsNotInStreak && <div>{streakLevels.length > 0 && selectedLevels.filter((lvl: string) => streakLevels.indexOf(lvl) === -1).map((lvl: string) => <p>{lvl}</p>)}</div>}
      {Object.keys(everyLevel).map(
        (difficultyKey) => <div>
          <p>{difficultyKey}</p>
          <Category hideLevels={hideLevels} useIgnoredLevels={useIgnoredLevels} clickedSpunky={clickedSpunky} allLevels={allLevels} setAllLevels={setAllLevels} handleRestart={handleRestart} selectedLevels={selectedLevels} setSelectedLevels={setSelectedLevels} difficultyKey={difficultyKey}></Category>
        </div>
      )}
      </div>
      <div className="w-1/2 md:w-1/3 text-center flex flex-col">
        {selectedLevels.length > 0 ? <div className="relative p-6 max-h-screen w-full flex flex-col items-center h-full border-8"
        style={{ borderColor:
          currentLevel ?
          allLevels[currentLevel].difficulty === "easy" ?
            "#89d56d" :
            allLevels[currentLevel].difficulty === "medium" ?
            "#f39c48" :
            allLevels[currentLevel].difficulty === "hard" ? 
            "#d54128" :
            "#ff9bfa"
            : ""
        }}>
          <div className="flex flex-col items-center self-end w-full gap-4">
            <div className="h-fit">
            {currentLevel &&  <div><div className="h-fit">{image}</div> <p>Difficulty: {allLevels[currentLevel].difficulty}</p><p>Type: {allLevels[currentLevel].type}</p></div>}
            </div>
            {answerRevealed && <p>{currentLevel}</p> || <p>&nbsp;</p>}
            {!answerRevealed && currentLevel && <input
              className="bg-cyan-100 h-12 w-64 text-black rounded-md"
              value={input}
              ref={inputRef}
              onChange={(e) => {
                if (e.target.value.toLowerCase().trim() === currentLevel.toLowerCase().trim()) {
                  handleGuessLevel(e.target.value)
                } else {
                setInput(e.target.value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGuessLevel(input);  
                }
              }}
            />}
          </div>
        </div> : <p>Select which levels to play</p>}
        {selectedLevels.length > 0 && <div className="absolute self-center bottom-0 mb-64 sm:mb-32 md:mb-6 left-1/2 md:-ml-12 flex flex-col gap-4">
        <p className="pointer-events-nonex">{streak} {showLevelsNotInStreak ? "(" + streakLevels.length : ""}{showLevelsNotInStreak ? " unique)" : ""}</p>
          {answerRevealed && <button ref={buttonRef} className="w-24 h-12 bg-green-500 rounded-md cursor-pointer" onClick={() => handleRestart()}>Play Again</button>}
          {currentLevel && !answerRevealed && <button ref={buttonRef} className="cursor-pointer w-24 h-12 bg-amber-500 rounded-md" onClick={() => setAnswerRevealed(true)}>Reveal Answer</button>}
          {!currentLevel && <button ref={buttonRef} onClick={() => handleStartGame()} className="w-24 h-12 bg-purple-500 cursor-pointer rounded-md">Start</button>}
        </div>}
      </div>
      <div className="w-1/6 md:w-1/3 bg-amber-200 text-black flex flex-col px-4"><img onClick={() => setClickedSpunky(!clickedSpunky)} className="cursor-pointer" src={`${import.meta.env.BASE_URL}Spunky.webp`} alt="Spunky" />
      How to play:
      <p className="pl-4">
          Select the levels you want to play with by revealing them in the sidebar.
          They will automatically be in rotation. 
          Clicking on a level removes it from the pool.
          </p>
      Controls:
      <p className="pl-4">
        Ctrl + Space:
        </p>
        <p className="pl-8">
          automatically clicks the button at the bottom
        </p>
        <p className="text-xs">
          Want to contribute? <a className="underline" href="https://youtu.be/lstNDLiE_SY">Watch the video guide</a>
        </p>
        <p className="text-xs">{packageJson.version}</p>
      </div>
    </main>
  )
}

export default App
