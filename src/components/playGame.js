import React, { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useParams, useHistory } from "react-router";
import { UserContext } from "../context/UserContext";

const PlayGame = (props) => {
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const [game, setGame] = useState(null);
  const {gameId} = useParams();
  const [error, setError] = useState("Error");
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [resultsId, setResultsId] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const genericErrorMessage = "Something went wrong! Please try again later.";

  const getGame = async() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            setError(genericErrorMessage);
        } else {
          let data = await response.json();
          setGame(data);
          setError("");
        }
        setFirstRequestDone(true);
      })
      .catch(error => {
        setError(genericErrorMessage);
        setFirstRequestDone(true);
      })
  }

  const getQuestions = async() => {
    let authString = `JWT ${userContext.access}`;
    console.log(authString);
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/questions/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authString
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            setError(genericErrorMessage);
        } else {
          let data = await response.json();
          setQuestions(data);
          setError("");
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
      })
  }

  const submitResult = async() => {
    const result = {      score: score,
      player: cookies.user,

      player: cookies.user
    }
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/results/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
      body: JSON.stringify(result),
    })
    .then(async response => {
      if (!response.ok) {
          let data = await response.json();
          setError(genericErrorMessage);
      } else {
        let data = await response.json();
        setResultsId(data.id);
        setError("");
      }
    })
    .catch(error => {
      setError(genericErrorMessage)
    });
  }

  const submitRating = async() => {
    const result = {
      score: score,
      player: cookies.user,
      rating: document.getElementById("ratingSelect").value
    }

    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/results/${resultsId}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
      body: JSON.stringify(result),
    })
    .then(async response => {
      if (!response.ok) {
          let data = await response.json();
          setError(genericErrorMessage);
      } else {
        let data = await response.json();
        setError("");
        setRatingSubmitted(true);
      }
    })
    .catch(error => {
      setError(genericErrorMessage)
    });
  }

  const submitAnswer = () => {
    for(let i = 0; i < questions[currentQuestion].answers.length; i++){
      let radio = document.getElementById(`answerRadio${i}`);
      if(radio.checked){
        if(questions[currentQuestion].answers[Number(radio.value)].correct){
          setScore(score+1);
          break;
        }
      }
    }
    if(currentQuestion === questions.length-1){
      submitResult();
    }
    setCurrentQuestion(currentQuestion+1);
  }

  useEffect(async () => {
    if(!firstRequestDone){
      await getGame();
      if(game && questions.length === 0){
        await getQuestions();
      }
    }
  }, [game, getGame, getQuestions]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-auto">
      <div className="h-16 w-4/5 bg-imperialRed overflow-hidden rounded-b-md">
        <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">{game ? game.name : ""}</h1>
      </div>
      {currentQuestion < questions.length && <div id="progressBar" className="transition-all duration-500 grid grid-cols-2 w-4/5 h-16 bg-spaceCadet rounded-lg overflow-auto content-center mt-4 px-6">
        <h2 className="ml-4 text-aliceBlue justify-self-start">{`Question ${currentQuestion+1} of ${questions.length}`}</h2>
      </div>}
      <div id="questionsDiv" className="transition-all duration-500 flex flex-col w-4/5 h-3/5 bg-manatee rounded-lg my-4 overflow-auto items-center py-6">
        {currentQuestion < questions.length && <div className="flex h-1/5 bg-gray-300 w-11/12 rounded-lg py-5 px-5">
          <h2 className="ml-4 text-spaceCadet">{`${questions[currentQuestion] ? questions[currentQuestion].questionText : ""}`}</h2>
        </div>}
        {questions.length > 0 && currentQuestion < questions.length && <div id="answersDiv"className="flex flex-col bg-gray-300 items-center justify-center rounded-md px-4 py-2 w-11/12 mt-10">
              <span className="w-full">
                <input type="radio" id="answerRadio0" name="answerSelect" className="mr-4" value="0"></input>
                <label type="text" htmlFor="answerRadio0" id="answerText0" className="w-4/5 h-10 text-lg">{questions[currentQuestion].answers[0].text}</label>
              </span>
              <span className="w-full mt-4">
                <input type="radio" id="answerRadio1" name="answerSelect" className="mr-4" value="1"></input>
                <label type="text" htmlFor="answerRadio1" id="answerText1" className="w-4/5 h-10 text-lg">{questions[currentQuestion].answers[1].text}</label>
              </span>
              {questions[currentQuestion].answers[2] && <span className="w-full mt-4">
                <input type="radio" id="answerRadio2" name="answerSelect" className="mr-4" value="2"></input>
                <label type="text" htmlFor="answerRadio2" id="answerText2" className="w-4/5 h-10 text-lg">{questions[currentQuestion].answers[2].text}</label>
              </span>}
              {questions[currentQuestion].answers[3] && <span className="w-full mt-4">
                <input type="radio" id="answerRadio3" name="answerSelect" className="mr-4" value="3"></input>
                <label type="text" htmlFor="answerRadio3" id="answerText3" className="w-4/5 h-10 text-lg">{questions[currentQuestion].answers[3].text}</label>
              </span>}
        </div>}
        { currentQuestion === questions.length && firstRequestDone &&(
            <div id="answersDiv"className="flex flex-col bg-gray-300 items-center justify-start rounded-md px-4 py-2 w-11/12 h-3/5 mt-10">
              <h2 className="text-3xl">{`${score} correct out of ${questions.length}!`}</h2>
              <h2 className="text-xl mt-10">{ratingSubmitted ? "Rating submitted!" : "Would you like to rate this quiz?"}</h2>
              {!ratingSubmitted && <select id="ratingSelect" className="text-xl my-4 w-10" onChange={(e) => {setSelectedRating(Number(e.target.value));}}>
                <option value=""> </option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>}
              {!ratingSubmitted && selectedRating !== 0 && <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 rounded-md self-center mr-2 hover:bg-gray-400"
                onClick={() => {submitRating()}}>
                Submit Rating
              </button>}
              <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 rounded-md self-center mr-2 mt-10 hover:bg-gray-400"
                onClick={() => history.go(0)}>
                Retry
              </button>
            </div>
        )}
        {currentQuestion < questions.length && <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-8 rounded-md self-center mr-2 hover:bg-gray-300" onClick={(e) => {submitAnswer(); e.preventDefault();}}>
          Submit
        </button>}
      </div>
    </div>
  );
}

export default PlayGame;