const ListDetails = ({ result, hiddenWord, gameLives }) => {
  //console.log("Error: "+{ result });

  const { meanings } = result;

  return (
    <div className="App-Game mx-auto mt-5">
      <h4 className="Game-Lives alert text-dark bg-warning text-dark rounded-0">
        <span role="img" aria-label="bomb"></span>
        💣 {gameLives}
      </h4>
      <div className="WordDefine h-100">
        <h1>What's this word?</h1>
        <p>This word is a {meanings[0].partOfSpeech}.</p>
        <h3>Definition:</h3>
        <p>{meanings[0].definitions[0].definition}</p>
      </div>
      <div className="HiddenWord alert text-dark bg-warning text-dark rounded-0">
        <p>{hiddenWord}</p>
      </div>
    </div>
  );
};

export default ListDetails;
