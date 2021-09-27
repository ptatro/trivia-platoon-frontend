import React, { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useParams, useHistory } from "react-router";
import { UserContext } from "../context/UserContext";

const GamePage = (props) => {
  const [gameDetailsCollapsed, setGameDetailsCollapsed] = useState(false);
  const [game, setGame] = useState(null);
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
            setError(genericErrorMessage);
        } else {
          let data = await response.json();
          setGame(data);
          setError("");
        }
      })
      .catch(error => {
        //setIsSubmitting(false)
        setError(genericErrorMessage)
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
          console.log(data);
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

  useEffect(async () => {
    if(!game){
      await getGame();
      if(userContext.access){getQuestions();}
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
        {!hasQuestions && gameId && <h1 className="mt-4 text-lg text-red-600">This game has no questions added.</h1>}
        {error && <h1 className="mt-4 text-lg text-red-600">{error}</h1>}
          <form id="gameDetailsForm" className={`flex flex-col h-full w-full justify-start items-center pt-2 ${gameDetailsCollapsed ? "hidden" : ""}`}>
            <label className="text-aliceBlue mr-2" htmlFor="gameTitleInput">Title</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameTitleInput" type="text" placeholder="Title" maxlength="255" value={game ? game.name: ""}></input>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="gameDescriptionText">Description</label>
            <textarea disabled className="w-3/5 h-1/3 p-2" id="gameDescriptionText" placeholder="Description" value={game ? game.description : ""}></textarea>
            {/* <fieldset className="flex flex-row w-3/5 my-4 border-2 border-aliceBlue rounded-md">
              <label className="text-spaceCadet mt-4 mr-2" htmlFor="gameImageUpload">Choose an image for the game (optional):</label>
              <input className="text-spaceCadet self-center my-2" id="gameImageUpload" name="gameImageUpload" type="file"/>
            </fieldset> */}
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
  );
}

export default GamePage;