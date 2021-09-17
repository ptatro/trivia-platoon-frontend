import React, { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

const Home = (props) => {
  const [games, setGames] = useState([]);

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
        {[...Array(20).keys()].map((i) => {return(
        <div className="transition-all h-11/12 w-11/12 grid grid-cols-4 bg-aliceBlue rounded-md mt-4 hover:bg-gray-400">
          <h2 className="justify-self-start ml-5 text-xl">{i}</h2>
          <h2 className="justify-self-start ml-5 text-xl">Sample Game</h2>
          <h2 className="justify-self-start ml-5 text-xl">Gregg R</h2>
          <h2 className="justify-self-start ml-5 text-xl">Rating</h2>
        </div>
        )})}
      </div>
    </div>
  </div>);
}

export default Home;