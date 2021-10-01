import React, { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useParams, useHistory } from "react-router";
import { UserContext } from "../context/UserContext";

const GamePage = (props) => {
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const [gameDetailsCollapsed, setGameDetailsCollapsed] = useState(false);
  const [game, setGame] = useState(null);
  const [results, setResults] = useState([]);
  const {gameId} = useParams();
  const [error, setError] = useState("");
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);
  const [hasQuestions, setHasQuestions] = useState(false);

  const gameDetailsCollapseButtonToggle = () => {
    let button = document.getElementById("gameDetailsCollapseButton");
    button.innerText = gameDetailsCollapsed ? "^" : "v"
    setGameDetailsCollapsed(!gameDetailsCollapsed);
  }

  const getGame = async() => {
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async response => {
        //setIsSubmitting(false)
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
        //setIsSubmitting(false)
        setError(genericErrorMessage);
        setFirstRequestDone(true);
      })
  }

  const getQuestions = async() => {
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
          }
          setError("");
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const getResults = () => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/results/`, {
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
          console.log(data);
          setResults(data);
          setError("");
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(async () => {
    if(!firstRequestDone){
      await getGame();
      if(game){
        getResults();
      }
      if(userContext.access && game){getQuestions();}
    }
  }, [game, getGame, getQuestions]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-auto">
      <div className={gameDetailsCollapsed ? "transition-all duration-300 flex flex-col w-4/5 h-0 bg-manatee rounded-b-lg" :
        "transition-all duration-300 flex flex-col w-4/5 h-auto bg-manatee rounded-b-lg"}>
        <div className="h-16 bg-imperialRed">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">{game ? game.name : ""}</h1>
        </div>
        <div className="flex flex-col h-full w-full">
        {!hasQuestions && gameId && firstRequestDone && <h1 className="mt-4 text-lg text-red-600">This game has no questions added.</h1>}
        
        {error && <h1 className="mt-4 text-lg text-red-600">{error}</h1>}
          <div className="flex flex-row w-full">
          {game && <img className="rounded-md m-2 max-w-sm" src={game.image}></img>}
          <form id="gameDetailsForm" className={`flex flex-col h-full w-full justify-start items-center pt-2 ${gameDetailsCollapsed ? "hidden" : ""}`}>
            <label className="text-aliceBlue mr-2" htmlFor="gameTitleInput">Title</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameTitleInput" type="text" placeholder="Title" maxlength="255" value={game ? game.name: ""}></input>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="gameDescriptionText">Description</label>
            <textarea disabled className="w-3/5 h-1/3 p-2" id="gameDescriptionText" placeholder="Description" value={game ? game.description : ""}></textarea>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="categorySelect">Category</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameCategoryText" type="text" value={game ? game.category : ""}></input>
            <div className="flex w-full items-center justify-center">
              <button disabled={userContext.access && hasQuestions ? false : true} className=" transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-4 rounded-md self-center mr-2 hover:bg-gray-300 disabled:opacity-50"
                onClick={(e) => {history.push(`/play/${gameId}`); e.preventDefault();}} title={userContext.access ? null : "Log in to play"}>
                Play
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-4/5 h-auto bg-manatee rounded-lg mt-10">
        <div className="h-16 bg-imperialRed">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Leaderboard</h1>
        </div>
        <div className="h-full w-full flex flex-col items-center overflow-auto">
          {results && results.map((r,i) => {
            return <div className="transition-all h-11/12 w-6/12 grid grid-cols-2 bg-aliceBlue rounded-md mt-4 hover:bg-gray-400">
              <h2 className="justify-self-start ml-5 text-xl">{r.player}</h2>
              <h2 className="justify-self-start ml-5 text-xl">{r.score}</h2>
            </div>
            })}
        </div>
      </div>
    </div>
  );
}

export default GamePage;