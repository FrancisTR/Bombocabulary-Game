const ListDetails = ({ result }) => {
  //console.log({ result });
  //HW: Take in a txt file and read all the words

  const { word, phonetics, meanings } = result;

  return (
    <div>
      <div>
        <h3>Word</h3>
        <div>
          <p>{word}</p>
          <p>{meanings[0].partOfSpeech}</p>
          <p>{phonetics[0].text}</p>
        </div>

        <div>
          <h3>Meaning:</h3>
          <p>{meanings[0].definitions[0].definition}</p>
        </div>

        <div>
          <h3>Synonyms:</h3>
          <p>
            {meanings[0].synonyms.map((item, index) => {
              return <p key={index}>{item}</p>;
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListDetails;
