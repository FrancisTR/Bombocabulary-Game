import axios from "axios";
import { useEffect, useState } from "react";

//Notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Components
import ListDetails from "./components/ListDetails";
import WinLose from "./components/WinLose";

import raw_text from "./words/words_alpha.txt";
import "./styles.scss";

//---App Function---
export default function App() {
  //Button Switch
  const [startButton, setStartButton] = useState(0);

  //User input
  const [keyWord, setKeyWord] = useState("");
  const [result, setResult] = useState(null);
  //Timer for the skip button. Default for 5 seconds
  const [seconds, setSeconds] = useState(5);

  //random index to choose a word from the txt
  var [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * 1000)
  );

  //random word
  const [randomWord, setRandomWord] = useState("");
  //Get the current word from the randomly choosen word
  //Use for comparison
  const [currentWord, setCurrentWord] = useState(randomWord);
  //Word to display to the user
  const [hiddenWord, setHiddenWord] = useState(guessWord());

  //player lives
  const [gameLives, setGameLives] = useState(null);
  //player score
  //index 0: Correct Word
  //index 1: Incorrect Word
  //index 2: Skip Word
  const [wordScores, setWordScores] = useState([0, 0, 0]);
  //Keep track of mode
  const [gameModeTrack, setGameModeTrack] = useState(null);

  const api = "https://api.dictionaryapi.dev/api/v2/entries/en";

  //Get a random index from the length of the wordList
  const randomNumberInRange = (max) => {
    const num = Math.floor(Math.random() * max);
    setRandomIndex(num);
  };

  //Format the txt to an array of words
  //Then, get a random index along with that random word from that index
  function generateWord() {
    fetch(raw_text)
      .then((r) => r.text())
      .then((text) => {
        const wordList = text.split("\n");
        //console.log(wordList); //An array

        randomNumberInRange(wordList.length);
        setRandomWord(wordList[randomIndex]);

        //console.log({ randomWord });
      });
  }

  //This is for "hiddenWord" state.
  //Randomly underline some characters for the user to guess
  function guessWord() {
    for (var i = 0, y = randomWord; i < randomWord.length / 2; i++) {
      var n = Math.floor(Math.random() * ((randomWord.length - 1) / 2));
      y = y.slice(0, n).concat("_", y.slice(n + 1));
    }
    return y;
  }

  //Check to see if the goal is either met or not
  if (gameLives !== null) {
    if (gameLives >= 15) {
      //Win
      setStartButton(2);
      setGameLives(null);
    } else if (gameLives <= 0) {
      //Lose
      setStartButton(3);
      setGameLives(null);
    }
  }

  //Clear the text field on click
  //Not Used
  // function handleClear() {
  //   setKeyWord("");
  // }

  //Randomly choose a word when the game starts.
  //The states initially starts off with "a" as our placeholder
  if (randomWord === "") {
    setRandomWord(handleSearch());
  }
  //Cooldown timer. Prevent spamming Skip
  if (seconds === 0 || (isNaN(seconds) && seconds !== "Skip (💣 -0.5)")) {
    setSeconds("Skip (💣 -0.5)");
  }
  useEffect(() => {
    var countdownTimer;
    countdownTimer = setInterval(() => {
      if (seconds !== 0) {
        setSeconds(seconds - 1);
      }
    }, 1100);
    return () => {
      clearInterval(countdownTimer);
    };
  });
  //Restart the timer when moving on to the next word
  const restartSkipCoolDown = () => {
    setSeconds(5);
  };
  //Give up button
  const giveUp = () => {
    setStartButton(4); //Gave Up
  };

  //---------------------
  //---------------------
  //---------------------
  //---------------------
  //Main functions to call
  async function handleSearch() {
    try {
      generateWord();
      const res = await axios.get(`${api}/${randomWord}`);
      //console.log(res, "res");
      setResult(res.data[0]);
    } catch (e) {
      console.log("Error");
    }
    setCurrentWord(randomWord);
    setHiddenWord(guessWord());
  }

  //Check the User's input and updating the score
  function checkWord(string) {
    //console.log(keyWord);
    //console.log({ currentWord });
    var prevWord = currentWord;

    if (string === "Skip") {
      //console.log("Skipped!");
      setGameLives(gameLives - 0.5);
      handleWordScore(2);
      notify("Skip", prevWord);
    } else if (keyWord.toLowerCase() === currentWord.toLowerCase()) {
      //console.log("Win!");
      setGameLives(gameLives + 1);
      handleWordScore(0);
      notify(true, prevWord);
    } else if (keyWord.toLowerCase() !== currentWord.toLowerCase()) {
      //console.log("Lose");
      setGameLives(gameLives - 1);
      handleWordScore(1);
      notify(false, prevWord);
    }
    restartSkipCoolDown();
    handleSearch();
    setKeyWord("");
  }

  //Notification of the guessed Word
  function notify(wordCheck, prevWord) {
    if (wordCheck === "Skip") {
      toast.warn(
        <div>
          <span role="img" aria-label="bomb"></span>
          Skipped! 💣 -0.5
          <p>
            Answer: <b>{prevWord}</b>
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark"
        }
      );
    } else if (wordCheck === true) {
      toast.success("Correct! 💣 +1", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark"
      });
    } else {
      toast.error(
        <div>
          <span role="img" aria-label="bomb"></span>
          Incorrect! 💣 -1
          <p>
            Answer: <b>{prevWord}</b>
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark"
        }
      );
    }
  }

  //Update the Score based on the user's action
  function handleWordScore(index) {
    const updateScore = wordScores.map((c, i) => {
      if (i === index) {
        // Increment
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setWordScores(updateScore);
  }

  //Difficulty Buttons from main page
  function startButtonSwitch(boolean, gameMode) {
    if (gameMode === "Easy") {
      setGameLives(10);
    } else if (gameMode === "Normal") {
      setGameLives(5);
    } else if (gameMode === "Hard") {
      setGameLives(1);
    }
    setSeconds(5);
    setGameModeTrack(gameMode);
    setStartButton(boolean);
    setWordScores([0, 0, 0]);
    handleSearch(); //Begin the Game
  }

  //Main Menu
  function MainMenuScreen() {
    setGameModeTrack(null);
    setStartButton(0);
  }
  //---------------------
  //---------------------
  //---------------------
  //---------------------

  //Switches
  if (startButton === 0) {
    //Main Menu
    return (
      <div className="App mx-auto w-50 mt-5 mb-5">
        <div className="MainMenu">
          <h1 className="alert text-dark bg-warning text-dark rounded-0">
            Welcome to Bombocabulary
          </h1>
          <h5 className="MainMenuDescription m-2">
            Solve as many words as you can without losing hearts from either
            skipping or getting the word incorrect! Reach 15 bombs to defuse
            this vocabulary bomb! Otherwise, boooooom...Game Over!
          </h5>
          <div className="StartButtons">
            {/* Cards */}
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  <span role="img" aria-label="bomb">
                    💣 💣 💣 💣 💣 💣 💣 💣 💣 💣
                  </span>
                </p>
                <button
                  className="btn btn-primary btn-lg w-100"
                  type="button"
                  onClick={() => startButtonSwitch(1, "Easy")}
                >
                  Easy Mode
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  <span role="img" aria-label="bomb">
                    💣 💣 💣 💣 💣
                  </span>
                </p>
                <button
                  className="btn btn-primary btn-lg w-100"
                  type="button"
                  onClick={() => startButtonSwitch(1, "Normal")}
                >
                  Normal Mode
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  <span role="img" aria-label="bomb">
                    💣
                  </span>
                </p>
                <button
                  className="btn btn-primary btn-lg w-100"
                  type="button"
                  onClick={() => startButtonSwitch(1, "Hard")}
                >
                  Hard Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (startButton === 1) {
    //The Game
    return (
      <div className="App mx-auto w-50 mt-5 mb-5">
        <div className="InputText">
          {result && <ListDetails {...{ result, hiddenWord, gameLives }} />}
          {/* User input */}
          <input
            className="form-control border border-warning w-75 mx-auto"
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            placeholder="Enter your answer"
          />

          {/* Buttons */}
          <div className="InputButtons">
            <button
              disabled={!keyWord}
              className="btn btn-success btn-lg w-75"
              type="submit"
              onClick={() => checkWord("Guessed")}
            >
              Enter
            </button>

            <ToastContainer
              position="top-center"
              autoClose={500}
              limit={3}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover={false}
              theme="dark"
            />

            <button
              disabled={seconds !== "Skip (💣 -0.5)"}
              className="btn btn-warning btn-lg w-75"
              type="submit"
              onClick={() => checkWord("Skip")}
            >
              <span role="img" aria-label="bomb"></span>
              {seconds}
            </button>

            <button
              className="btn btn-secondary btn-lg w-75"
              type="submit"
              onClick={() => giveUp()}
            >
              Give Up
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    //Result Page
    return (
      <div className="App mx-auto w-50 mt-5 mb-5">
        <WinLose
          mainMessage={startButton}
          wordC={wordScores[0]}
          wordInc={wordScores[1]}
          wordSkip={wordScores[2]}
        />
        <div className="InputButtons">
          <button
            className="btn btn-primary btn-lg w-75"
            type="submit"
            onClick={() => startButtonSwitch(1, gameModeTrack)}
          >
            Play Again
          </button>

          <button
            className="btn btn-primary btn-lg w-75"
            type="submit"
            onClick={() => MainMenuScreen()}
          >
            Main Menu
          </button>
        </div>
      </div>
    );
  }
}
