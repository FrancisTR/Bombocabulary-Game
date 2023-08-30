//Shows the user's stats
const WinLose = (props) => {
  //Message display based on number
  var message = null;
  var color = "";
  if (props.mainMessage === 2) {
    //Win
    message = "Defused!";
    color = "ResultMessage alert text-dark bg-info text-dark rounded-0";
  } else if (props.mainMessage === 3) {
    //Lose
    message = "Game Over!";
    color = "ResultMessage alert text-dark bg-warning text-dark rounded-0";
  } else if (props.mainMessage === 4) {
    //Give Up
    message = "I Give Up!";
    color = "ResultMessage alert text-dark bg-secondary text-dark rounded-0";
  }

  //Calculate the Grade
  var grade = "?";
  if (props.mainMessage !== 4) {
    var total = props.wordC + props.wordInc + props.wordSkip;
    var calculateScore =
      (props.wordC - props.wordInc - props.wordSkip / total) * 10;
    //console.log(calculateScore);

    if (calculateScore < 60) {
      grade = "F";
    } else if (calculateScore >= 60 && calculateScore < 70) {
      grade = "D";
    } else if (calculateScore >= 70 && calculateScore < 80) {
      grade = "C";
    } else if (calculateScore >= 80 && calculateScore < 90) {
      grade = "B";
    } else if (calculateScore >= 90) {
      grade = "A";
    }
  }

  return (
    <div className="App-Result mx-auto mt-5">
      <h4 className={color}>{message}</h4>
      <div className="DetailResults">
        <h1>Final Results</h1>
        <p>Words Correct: {props.wordC}</p>
        <p>Words Incorrect: {props.wordInc}</p>
        <p>Words Skipped: {props.wordSkip}</p>
        <h2>
          Rank: <span>{grade}</span>
        </h2>
      </div>
    </div>
  );
};

export default WinLose;
