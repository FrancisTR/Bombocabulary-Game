import axios from "axios";
import { useState } from "react";
import ListDetails from "./components/ListDetails";
import "./styles.css";

export default function App() {
  const [keyWord, setKeyWord] = useState("");
  const [result, setResult] = useState(null);

  const api = "https://api.dictionaryapi.dev/api/v2/entries/en";

  async function handleSearch() {
    try {
      const res = await axios.get(`${api}/${keyWord}`);
      console.log(res, "res");
      setResult(res.data[0]);
    } catch (e) {
      console.log({ e });
    }
  }

  function handleClear() {
    setKeyWord("");
    setResult(null);
  }

  return (
    <div className="App">
      <input
        className="form-control"
        value={keyWord}
        onChange={(e) => setKeyWord(e.target.value)}
      />
      <button className="btn btn-primary" type="submit" onClick={handleSearch}>
        Search
      </button>

      <button
        disabled={!result}
        className="btn btn-primary"
        type="submit"
        onClick={handleClear}
      >
        Clear
      </button>

      {result && <ListDetails {...{ result }} />}
    </div>
  );
}
