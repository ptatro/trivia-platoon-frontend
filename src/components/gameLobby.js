import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useHistory } from "react-router";
import { UserContext } from "../context/UserContext";
import { useCookies } from "react-cookie";

const GameLobby = (props) => {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['refresh', 'user', 'username']); // eslint-disable-line
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const [questionRequestDone, setQuestionRequestDone] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [gameStatus, setGameStatus] = useState("lobby");
  const [results, setResults] = useState([]);
  const {slug} = useParams();
  const [error, setError] = useState("");
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext); // eslint-disable-line
  const [hasQuestions, setHasQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [startTimer, setStartTimer] = useState(1);
  const [questionTimer, setQuestionTimer] = useState(15);
  const [questionSeconds, setQuestionSeconds] = useState(15);
  const [waitingStatus, setWaitingStatus] = useState("waiting for other players");
  const [allResults, setAllResults] = useState([]);
  const qTimeout = useRef(null);
  const genericErrorMessage = "Something went wrong! Please try again later."


  const getGameInstance = useCallback(() => {
    console.log(slug);
    const genericErrorMessage = "Error acquiring the game instance. Please try again later.";
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/lobby/${slug}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            setError(genericErrorMessage);
            console.log(data);
            setTimeout(getGameInstance, 1 * 60 * 1000);
            setFirstRequestDone(true);
        } else {
          let data = await response.json();
          console.log(data);
          setGameInstance(data);
          setGameId(data.game);
          setQuestionTimer(Number(data.questiontimer));
          setQuestionSeconds(Number(data.questiontimer));
          setError("");
          if(firstRequestDone){setFirstRequestDone(false);}
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
        console.log(error);
        setFirstRequestDone(true);
        setTimeout(getGameInstance, 1 * 60 * 1000);
      })
  }, [slug, setFirstRequestDone, setGameInstance, userContext]);

  const getGame = useCallback(() => {
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
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
  }, [setFirstRequestDone, setGame, gameId]);

  const getQuestions = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/questions/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
        } else {
          let data = await response.json();
          if(data.length > 0){
            setHasQuestions(true);
            setQuestions(data);
          }
          setError("");
        }
        setQuestionRequestDone(true);
      })
      .catch(error => {
        console.log(error);
        setQuestionRequestDone(true);
      })
  }, [setQuestionRequestDone, setHasQuestions, userContext, gameId]);

  const submitRating = async() => {
    const result = {
      score: score,
      player: cookies.user,
      rating: document.getElementById("ratingSelect").value
    }
    console.log("Submit rating");
  }

  const submitResult = async() => {
    const result = {
      score: score,
      player: cookies.user,
    }
    socket.send(JSON.stringify(result));
  }
  
  const submitAnswer = (timeout) => {
    console.log(qTimeout.current);
    clearTimeout(qTimeout.current);
    for(let i = 0; i < questions[currentQuestion].answers.length; i++){
      let radio = document.getElementById(`answerRadio${i}`);
      if(radio && radio.checked){
        if(questions[currentQuestion].answers[Number(radio.value)].correct){
          setScore(score+1);
          break;
        }
      }
    }
    if(currentQuestion === questions.length-1){
      submitResult();
      setCurrentQuestion(currentQuestion+1);
      setGameStatus("finished");
    }
    else{
      setCurrentQuestion(currentQuestion+1);
      setQuestionSeconds(questionTimer);
    }
  }

  useEffect(() => {
    if(gameStatus === "started" && questionSeconds === questionTimer){
      beginQuestionTimer();
    }
  }, [questionSeconds]);

  const beginStartTimer = (time) => {
    time = time === 0 || time ? time : startTimer
    if(time === 0){
      setGameStatus("started");
    }
    else{
      setStartTimer(time-1);
      if(time !== 0){setTimeout(() => beginStartTimer(time-1), 1000);}
    }
  }

  const beginQuestionTimer = (time) => {
    time = (time === 0 || time) ? time : questionSeconds
    if(time === 0){
      submitAnswer();
    }
    else{
      setQuestionSeconds(time-1);
      if(time !== 0){qTimeout.current = setTimeout(() => {beginQuestionTimer(time-1)}, 1000)}
    }
  }

  const socketListener = (message) => {
    if(message.data !== "message received"){
      let data = JSON.parse(message.data);
      console.log(data);
      if(data.message_trigger){
        if(data.message_trigger === "start"){
          if(gameStatus !== "starting"){
            console.log(gameInstance)
            beginStartTimer();
            setGameStatus("starting");
          }
        }
        else if(data.message_trigger === "waiting for other players"){
          setWaitingStatus(data.message_trigger);
        }
        else if(data.message_trigger === "complete"){
          setWaitingStatus(data.message_trigger);
          setAllResults(data.all_results);
        }
      }
    }
  }

  useEffect(() => {
    if(!socket && slug && userContext.access){
      const url = `${process.env.REACT_APP_SOCKET_ENDPOINT}gameinstance/${slug}?player=${cookies.user}&token=${userContext.access}`;
      let newSocket = new WebSocket(url);
      setSocket(newSocket);
    }
    if(!firstRequestDone && userContext.access && socket){
      socket.addEventListener('message', socketListener);
      removeCookies("refresh", {path:"/game"});
      removeCookies("user", {path:"/game"});
      removeCookies("username", {path:"/game"});

      if(slug){
        if(!gameInstance) {getGameInstance();}
        if(gameId && !game){
          getGame();
        }
      }
    }
    if(userContext.access && game && !questionRequestDone){getQuestions();}
    if(socket){
      return () => {socket.close();}
    }
    if(gameStatus === "started"){
      console.log("started");
      beginQuestionTimer();
    }
  }, [game, getGame, getQuestions, userContext, questionRequestDone, firstRequestDone, removeCookies, slug, socket, setSocket, gameStatus, setQuestionSeconds]);

  return (
    (gameStatus === "lobby" || gameStatus === "starting") && <div className="flex flex-col items-center justify-start w-full h-full overflow-auto pb-10">
      <div className="transition-all duration-300 flex flex-col w-4/5 h-auto bg-manatee rounded-b-lg">
        <div className="h-16 bg-imperialRed">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">{game ? game.name : ""}</h1>
        </div>
        <div className="flex flex-col h-full w-full">
        {!hasQuestions && gameId && firstRequestDone && questionRequestDone && <h1 className="mt-4 text-lg text-red-600">This game has no questions added.</h1>}
        
        {error && <h1 className="mt-4 text-lg text-red-600">{error}</h1>}
          <div className="flex flex-row w-full">
          {game && <img className="rounded-md m-2 max-w-sm" alt="game" src={game.image}></img>}
          <form id="gameDetailsForm" className="flex flex-col h-full w-full justify-start items-center pt-2">
            <label className="text-aliceBlue mr-2" htmlFor="instanceInput">Instance</label>
            <input disabled className="w-3/5 h-10 text-lg" id="instanceInput" type="text" placeholder="Title" maxlength="255" value={gameInstance ? gameInstance.slug: ""}></input>
            <label className="text-aliceBlue mr-2" htmlFor="gameTitleInput">Title</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameTitleInput" type="text" placeholder="Title" maxlength="255" value={game ? game.name: ""}></input>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="gameDescriptionText">Description</label>
            <textarea disabled className="w-3/5 h-1/3 p-2" id="gameDescriptionText" placeholder="Description" value={game ? game.description : ""}></textarea>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="categorySelect">Category</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameCategoryText" type="text" value={game ? game.category : ""}></input>
            <label className="text-aliceBlue mr-2" htmlFor="instanceHost">Host</label>
            <input disabled className="w-3/5 h-10 text-lg" id="instanceHost" type="text" placeholder="Title" maxlength="255" value={gameInstance ? gameInstance.creator: ""}></input>
            {gameInstance && Number(gameInstance.creator) === Number(cookies.user) && socket && <div className="flex w-full items-center justify-center">
              <button className=" transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-4 rounded-md self-center mr-2 hover:bg-gray-300 disabled:opacity-50"
                onClick={(e) => {e.preventDefault(); socket.send(JSON.stringify({creator_start: true})) }}>
                Start
              </button>
            </div>}
          </form>
          </div>
        </div>
      </div>
      {gameStatus === "starting" && <div className="flex flex-col w-3/5 h-auto bg-manatee rounded-lg mt-10">
        <h1 className="text-3xl text-aliceBlue">{`Game starting in ${startTimer} seconds!`}</h1>
        </div>}
    </div>

    ||

    (gameStatus === "started" || gameStatus === "finished") && <div className="flex flex-col items-center justify-start w-full h-full overflow-auto">
    <div className="h-16 w-4/5 bg-imperialRed overflow-hidden rounded-b-md">
      <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">{game ? game.name : ""}</h1>
    </div>
    {currentQuestion < questions.length && <div id="progressBar" className="transition-all duration-500 grid grid-cols-2 w-4/5 h-16 bg-spaceCadet rounded-lg overflow-auto content-center mt-4 px-6">
      <h2 className="ml-4 text-aliceBlue justify-self-start">{`Question ${currentQuestion+1} of ${questions.length}`}</h2>
      <h2 className="ml-4 text-aliceBlue justify-self-end">{`Time: ${questionSeconds}`}</h2>
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
      { currentQuestion === questions.length && firstRequestDone && questionRequestDone && (
          <div id="answersDiv"className="flex flex-col bg-gray-300 items-center justify-start rounded-md px-4 pt-2 pb-6 w-11/12 h-auto mt-10">
            <h2 className="text-3xl">{`${score} correct out of ${questions.length}!`}</h2>
          </div>
      )}
      {gameStatus === "finished" && waitingStatus === "waiting for other players" &&
        <div className="flex flex-col w-3/5 h-auto bg-manatee rounded-lg mt-10">
          <h1 className="text-3xl text-aliceBlue">Waiting for other players...</h1>
        </div>
      }
      {
        gameStatus === "finished" && waitingStatus === "complete" && 
        <div className="flex flex-col w-3/5 h-screen bg-manatee rounded-lg mt-10">
        <div className="h-16 bg-imperialRed">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Results</h1>
        </div>
        <div className="h-full w-full flex flex-col items-center overflow-auto pb-8">
          <div className="transition-all h-11/12 w-6/12 grid grid-cols-3 text-aliceBlue mt-4">
            <h2 className="justify-self-start ml-5 text-xl">#</h2>
            <h2 className="justify-self-start ml-5 text-xl">User</h2>
            <h2 className="justify-self-start ml-5 text-xl">Score</h2>
          </div>
          {allResults && allResults.map((r,i) => {
            return <div className="transition-all h-11/12 w-6/12 grid grid-cols-3 bg-aliceBlue rounded-md mt-4 hover:bg-gray-400">
              <h2 className="justify-self-start ml-5 text-xl">{i + 1}</h2>
              <h2 className="justify-self-start ml-5 text-xl">{r.player}</h2>
              <h2 className="justify-self-start ml-5 text-xl">{r.score}</h2>
            </div>
            })}
        </div>
      </div>
      }
      {currentQuestion < questions.length && <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-8 rounded-md self-center mr-2 hover:bg-gray-300" onClick={(e) => {submitAnswer(); e.preventDefault();}}>
        Submit
      </button>}
    </div>
  </div>

  );
}

export default GameLobby;