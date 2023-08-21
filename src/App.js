import axios from "axios";
import { useState } from "react";
import ListDetails from "./components/ListDetails";
import "./styles.css";

export default function App() {
  const [keyWord, setKeyWord] = useState("");
  const [result, setResult] = useState(null);

  //placeholder for now
  const [resultTemp, setResultTemp] = useState([
    "Good",
    "Morning",
    "Hello",
    "There"
  ]);
  var [randomIndex, setRandomIndex] = useState(0);
  const [randomWord, setRandomWord] = useState(resultTemp[randomIndex]);

  const api = "https://api.dictionaryapi.dev/api/v2/entries/en";

  const randomNumberInRange = (max) => {
    const num = Math.floor(Math.random() * max);
    setRandomIndex(num);
  };

  const generateWord = () => {
    randomNumberInRange(resultTemp.length);
    setRandomWord(resultTemp[randomIndex]);
    console.log({ randomWord });
  };

  async function handleSearch() {
    try {
      generateWord();
      const res = await axios.get(`${api}/${randomWord}`);
      console.log(res, "res");
      setResult(res.data[0]);
    } catch (e) {
      console.log({ e });
    }

    // fetch("./words/words_alpha.txt")
    //   .then((r) => r.text())
    //   .then((text) => {
    //     console.log(text);
    //   });
  }

  //Not used
  // function handleClear() {
  //   setKeyWord("");
  //   setResult(null);
  // }

  return (
    <div className="App">
      <input
        className="form-control"
        value={keyWord}
        onChange={(e) => setKeyWord(e.target.value)}
      />
      {/* <button className="btn btn-primary" type="submit" onClick={handleSearch}>
        Search
      </button> */}

      <button className="btn btn-primary" type="submit" onClick={handleSearch}>
        Generate
      </button>

      {result && <ListDetails {...{ result }} />}
    </div>
  );
}
