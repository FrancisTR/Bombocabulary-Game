const ListDetails = ({ result, hiddenWord }) => {
  //console.log({ result });

  const { meanings } = result;

  return (
    <div className="WordCard container mx-auto mt-5">
      <div>
        <h1>What's this word?</h1>
        <div>
          <p>This word is a {meanings[0].partOfSpeech}.</p>
        </div>

        <div>
          <h3>Definition:</h3>
          <p>{meanings[0].definitions[0].definition}</p>
        </div>

        <div>
          <h3>{hiddenWord}</h3>
        </div>

        {/* <div>
          <h3>Synonyms:</h3>
          <p>
            {meanings[0].synonyms.map((item, index) => {
              return <p key={index}>{item}</p>;
            })}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ListDetails;
