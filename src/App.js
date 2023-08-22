import axios from "axios";
import { useEffect, useState } from "react";
import ListDetails from "./components/ListDetails";

import raw_text from "./words/words_alpha.txt";
import "./styles.scss";

export default function App() {
  //User input
  const [keyWord, setKeyWord] = useState("");
  const [result, setResult] = useState(null);

  //random words
  var [randomIndex, setRandomIndex] = useState(
    Math.floor(Math.random() * 1000)
  );
  const [randomWord, setRandomWord] = useState("Welcome");
  const [currentWord, setCurrentWord] = useState(randomWord);
  const [hiddenWord, setHiddenWord] = useState(guessWord());

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

  function checkWord() {
    //console.log(keyWord);
    //console.log({ currentWord });
    if (keyWord === currentWord) {
      console.log("Win!");
      handleSearch();
    } else {
      console.log("Lose");
    }
  }

  function handleClear() {
    setKeyWord("");
    //setResult(null);
  }

  return (
    <div className="App">
      {result && <ListDetails {...{ result, hiddenWord }} />}

      {/* User input */}
      <input
        className="form-control w-50 mx-auto"
        value={keyWord}
        onChange={(e) => setKeyWord(e.target.value)}
      />

      {/* Buttons */}
      <div className="InputButtons">
        <button
          disabled={!keyWord}
          className="btn btn-success btn-lg"
          type="submit"
          onClick={checkWord}
        >
          Enter
        </button>

        <button
          disabled={!keyWord}
          className="btn btn-info btn-lg"
          type="submit"
          onClick={handleClear}
        >
          Clear
        </button>

        <button
          className="btn btn-warning btn-lg"
          type="submit"
          onClick={handleSearch}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
