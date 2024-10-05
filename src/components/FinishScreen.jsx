export default function FinishScreen({scores, totalScores}) {
    const percentage=(scores/totalScores)*100
  return (
    <p className="result">
      You scored <strong>{scores}</strong> out of {totalScores} {Math.ceil(percentage)}%
    </p>
  );
}