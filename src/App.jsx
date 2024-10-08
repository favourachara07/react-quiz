import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  scores : 0,
  highScore: 0,
  secondsRemaining: 300,
};
// all state transitons are handled in the reducer
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      // current question
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        scores:
          action.payload === question.correctOption
            ? state.scores + question.points
            : state.scores,
      };
    }
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finished":
      return {
        ...state,
        status: "finished",
        highScore: state.scores > state.highScore ? state.scores : state.highScore,
      };
    case "restart":
      return {
        ...initialState, questions: state.questions,
        highScore: state.highScore,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{ questions, status, index, answer, scores, highScore, secondsRemaining }, dispatch] = useReducer(
    reducer,
    initialState
  );
  document.title = "ReactQuiz";
  // derived state
  const numQuestions = questions.length;
  // reduce the array of questions to get the total scores using prev(0) and cur in d array
  const totalScores= questions.reduce((prev, cur) => prev + cur.points, 0);
  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
          <Progress index={index} numQuestions={numQuestions} scores={scores} totalScores={totalScores} answer={answer}/>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
              <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index}/>
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen scores={scores} totalScores={totalScores} highScore={highScore} dispatch={dispatch}/>} 
      </Main>
    </div>
  );
}
