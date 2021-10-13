import React, { useEffect, useState, useCallback } from "react"
import { useHistory } from "react-router";

const Home = (props) => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(""); // eslint-disable-line
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const history = useHistory();

  const getGames = useCallback(() => {
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games?filtered=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            setError(genericErrorMessage);
            console.log(data);
            setTimeout(getGames, 1 * 60 * 1000);
        } else {
          let data = await response.json();
          setGames(data);
          setError("");
        }
        setFirstRequestDone(true);
      })
      .catch(error => {
        setError(genericErrorMessage)
        console.log(error);
        setFirstRequestDone(true);
        setTimeout(getGames, 1 * 60 * 1000);
      })
  }, [setFirstRequestDone, setGames]);
  useEffect(() => {
    if(!firstRequestDone){
      getGames();
    }
  }, [games, getGames, firstRequestDone]);

  return (<div className="transition-all flex flex-col w-full h-full items-center">
    {/* Intro banner */}
    <div className="flex flex-col w-4/5 h-1/4 bg-manatee rounded-b-lg">
      <div className="h-16 bg-imperialRed overflow-hidden">
        <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Welcome to Trivia Platoon, the collaborative trivia game.</h1>
      </div>
      <h2 className="text-xl text-aliceBlue mt-4 md:text-2xl">1. Create a game.</h2>
      <h2 className="text-xl text-aliceBlue mt-4 md:text-2xl">2. Invite your friends.</h2>
      <h2 className="text-xl text-aliceBlue mt-4 md:text-2xl">3. Profit?</h2>
    </div>
    {/* Game list */}
    <div className="flex flex-col w-4/5 h-3/5 bg-manatee rounded-lg mt-10 items-center overflow-auto">
      <div className="h-16 w-full bg-imperialRed overflow-hidden justify-center"><h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Game List</h1></div>
      <div className="h-full w-full flex flex-col items-center overflow-auto">
        <div className="transition-all h-11/12 w-11/12 grid grid-cols-5 text-aliceBlue mt-4">
            <h2 className="justify-self-start ml-5 text-xl">#</h2>
            <h2 className="justify-self-start ml-5 text-xl">Name</h2>
            <h2 className="justify-self-start ml-5 text-xl">Creator</h2>
            <h2 className="justify-self-start ml-5 text-xl">Category</h2>
            <h2 className="justify-self-start ml-5 text-xl">Avg Rating</h2>
          </div>
        {games && games.map((g,i) => {
        return <div className="transition-all h-11/12 w-11/12 grid grid-cols-5 bg-aliceBlue rounded-md my-2 hover:bg-gray-400" onClick={() => history.push(`/game/${g.id}`)}>
          <h2 className="justify-self-start ml-5 text-xl">{i + 1}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{g.name}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{g.creator.username}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{g.category}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{Number(g.rating_count) > 0 ? Math.round((Number(g.rating_total)/Number(g.rating_count))*10)/10 : "No Ratings"}</h2>
        </div>
        })}
      </div>
    </div>
  </div>);
}

export default Home;