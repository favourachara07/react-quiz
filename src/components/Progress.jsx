export default function Progress({index, numQuestions,scores, totalScores, answer}) {
  return (
    <header className="progress">
        <progress max={numQuestions} value={index+ Number(answer!== null)}></progress>
      <p>Question <strong>{index+1}</strong> /{numQuestions}</p>
      <p><strong>{scores}</strong>/{totalScores}</p>
    </header>
  );
} 