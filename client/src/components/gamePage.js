import React, { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useParams } from "react-router";
import { UserContext } from "../context/UserContext";

const GamePage = (props) => {
  const [gameDetailsCollapsed, setGameDetailsCollapsed] = useState(false);
  const [game, setGame] = useState(null);
  const {gameId} = useParams();
  const [error, setError] = useState("")
  const gameDetailsCollapseButtonToggle = () => {
    let button = document.getElementById("gameDetailsCollapseButton");
    button.innerText = gameDetailsCollapsed ? "^" : "v"
    setGameDetailsCollapsed(!gameDetailsCollapsed);
  }

  const getGame = async() => {
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch("http://localhost:8000/api/games/" + `${gameId}/`, {
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

  useEffect(() => {
    if(!game){
      getGame();
    }
  }, [game, getGame]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-auto">
      <div className={gameDetailsCollapsed ? "transition-all duration-300 flex flex-col w-4/5 h-0 bg-manatee rounded-b-lg" :
        "transition-all duration-300 flex flex-col w-4/5 h-2/5 bg-manatee rounded-b-lg"}>
        <div className="h-16 bg-imperialRed overflow-hidden">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Game Title</h1>
        </div>
        <div className="flex flex-col h-full w-full">
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
              <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-4 rounded-md self-center hover:bg-gray-300 mr-2"
                onClick={(e) => {console.log("Play"); e.preventDefault();}}>
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