import axios from "axios";
import { useEffect, useState } from "react";
import ListDetails from "./components/ListDetails";

import raw_text from "./words/words_alpha.txt";
import "./styles.scss";

export default function App() {
  //Switch
  const [startButton, setStartButton] = useState(0);

  //User input
  const [keyWord, setKeyWord] = useState("");
  const [result, setResult] = useState(null);

  //random words
  var [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * 1000)
  );
  const [randomWord, setRandomWord] = useState("welcome");
  const [currentWord, setCurrentWord] = useState(randomWord);
  const [hiddenWord, setHiddenWord] = useState(guessWord());

  //player lives
  const [gameLives, setGameLives] = useState(0);
  //Keep track of mode
  const [gameModeTrack, setGameModeTrack] = useState(null);

  const api = "https://api.dictionaryapi.dev/api/v2/entries/en";

  const randomNumberInRange = (max) => {
    const num = Math.floor(Math.random() * max);
    setRandomIndex(num);
  };

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

  function guessWord() {
    for (var i = 0, y = randomWord; i < randomWord.length / 2; i++) {
      var n = Math.floor(Math.random() * ((randomWord.length - 1) / 2));
      y = y.slice(0, n).concat("_", y.slice(n + 1));
    }
    return y;
  }

  async function handleSearch() {
    try {
      generateWord();
      const res = await axios.get(`${api}/${randomWord}`);
      console.log(res, "res");
      setResult(res.data[0]);
    } catch (e) {
      console.log({ e });
    }
    setCurrentWord(randomWord);
    setHiddenWord(guessWord());
  }

  useEffect(() => {
    handleSearch();
  }, []);

  function gameLivesCondition() {
    if (gameLives >= 15) {
      setStartButton(2);
    } else if (gameLives <= 0) {
      setStartButton(3);
    }
  }

  function checkWord(string) {
    //console.log(keyWord);
    //console.log({ currentWord });

    if (string === "Skip") {
      console.log("Skipped!");
      setGameLives(gameLives - 0.5);
    } else if (keyWord.toLowerCase() === currentWord.toLowerCase()) {
      console.log("Win!");
      setGameLives(gameLives + 1);
    } else {
      console.log("Lose");
      setGameLives(gameLives - 1);
    }
    handleSearch();
    setKeyWord("");
    gameLivesCondition();
  }

  function handleClear() {
    setKeyWord("");
    //setResult(null);
  }

  function startButtonSwitch(boolean, gameMode) {
    if (gameMode === "Easy") {
      setGameLives(10);
    } else if (gameMode === "Normal") {
      setGameLives(5);
    } else if (gameMode === "Hard") {
      setGameLives(1);
    }
    setGameModeTrack(gameMode);
    setStartButton(boolean);
  }

  function MainMenuScreen() {
    setGameModeTrack(null);
    setStartButton(0);
  }

  if (startButton === 0) {
    return (
      <div className="App mx-auto w-75 mt-5">
        <div className="MainMenu">
          <div className="card-body">
            <h1 className="card-title alert alert-primary text-dark bg-info text-dark">
              Welcome to Bombocabulary!
            </h1>
            <h4 className="card-text mt-3">
              Solve as many words as you can without losing hearts from either
              skipping or getting the word incorrect! Reach 15 hearts to defuse
              this vocabulary bomb! Otherwise, boooooom!
            </h4>
            <div className="StartButtons">
              {/* Cards */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Easy Mode</h5>
                  <p className="card-text">
                    <span role="img" aria-label="heart">
                      ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
                    </span>
                  </p>
                  <button
                    className="btn btn-primary btn-lg w-25 mt-3"
                    type="button"
                    onClick={(e) => startButtonSwitch(1, "Easy")}
                  >
                    Easy
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Normal Mode</h5>
                  <p className="card-text">
                    <span role="img" aria-label="heart">
                      ❤️❤️❤️❤️❤️
                    </span>
                  </p>
                  <button
                    className="btn btn-primary btn-lg w-25 mt-3"
                    type="button"
                    onClick={(e) => startButtonSwitch(1, "Normal")}
                  >
                    Normal
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Hard Mode</h5>
                  <p className="card-text">
                    <span role="img" aria-label="heart">
                      ❤️
                    </span>
                  </p>
                  <button
                    className="btn btn-primary btn-lg w-25 mt-3"
                    type="button"
                    onClick={(e) => startButtonSwitch(1, "Hard")}
                  >
                    Hard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (startButton === 1) {
    return (
      <div className="App mx-auto w-75 mt-5">
        <div className="InputText">
          <h4 className="alert alert-primary text-dark bg-warning text-dark">
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            {gameLives}
          </h4>
          {result && <ListDetails {...{ result, hiddenWord }} />}
          {/* User input */}
          <input
            className="form-control border border-primary w-75 mx-auto"
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            placeholder="Enter your answer"
          />

          {/* Buttons */}
          <div className="InputButtons">
            <button
              className="btn btn-warning btn-lg w-25"
              type="submit"
              onClick={(e) => checkWord("Skip")}
            >
              Skip
            </button>

            <button
              disabled={!keyWord}
              className="btn btn-success btn-lg w-25"
              type="submit"
              onClick={(e) => checkWord("Guessed")}
            >
              Enter
            </button>

            <button
              disabled={!keyWord}
              className="btn btn-info btn-lg w-25"
              type="submit"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  } else if (startButton === 2) {
    //Victory
    return (
      <div className="App mx-auto w-75 mt-5">
        <div className="InputText">
          <h4 className="alert alert-primary text-dark bg-warning text-dark">
            Defused!
          </h4>

          {/* Buttons */}
          <div className="InputButtons">
            <button
              className="btn btn-primary btn-lg w-25"
              type="button"
              onClick={(e) => startButtonSwitch(1, gameModeTrack)}
            >
              Play Again
            </button>

            <button
              className="btn btn-primary btn-lg w-25"
              type="button"
              onClick={(e) => MainMenuScreen()}
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    //GameOver
    return (
      <div className="App mx-auto w-75 mt-5">
        <div className="InputText">
          <h4 className="alert alert-primary text-dark bg-warning text-dark">
            Boooooooooooom!
          </h4>

          {/* Buttons */}
          <div className="InputButtons">
            <button
              className="btn btn-primary btn-lg w-25"
              type="submit"
              onClick={(e) => startButtonSwitch(1, gameModeTrack)}
            >
              Retry
            </button>

            <button
              className="btn btn-primary btn-lg w-25"
              type="submit"
              onClick={(e) => MainMenuScreen()}
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }
}
