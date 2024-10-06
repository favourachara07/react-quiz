export default function FinishScreen({scores, totalScores, highScore, dispatch}) {
    const percentage=(scores/totalScores)*100
    let emoji;
    if(percentage===100) emoji='🥇';
    if(percentage<100 && percentage>=80) emoji='🥈';
    if(percentage<80 && percentage>=60) emoji='🥉'  ;
    if(percentage<60 && percentage>=40) emoji='🎖️';
    if(percentage<40) emoji='🚫';
  return (
    <>
        <p className="result">
          <span>{emoji}</span> You scored <strong>{scores}</strong> out of {totalScores} ({Math.ceil(percentage)}%)
        </p>
        <p className="highscore">{`Highscore: ${highScore} score`}</p>
        <button onClick={()=> dispatch({type: 'restart'})} className="btn btn-ui">Restart</button>
    </>
  );
}