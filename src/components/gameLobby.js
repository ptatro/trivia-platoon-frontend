import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router";
import { UserContext } from "../context/UserContext";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import {WebSocketClient} from "websocket";

const GameLobby = (props) => {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['refresh', 'user', 'username']); // eslint-disable-line
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const [questionRequestDone, setQuestionRequestDone] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [results, setResults] = useState([]);
  const {slug} = useParams();
  const [error, setError] = useState("");
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext); // eslint-disable-line
  const [hasQuestions, setHasQuestions] = useState(false);

  const getGameInstance = useCallback(() => {
    console.log(slug);
    const genericErrorMessage = "Error acquiring the game instance. Please try again later.";
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/gameinstances`, {
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
          //Temporary loop, until we can get instance by slug
          //TODO: use gameinstances slug route
          for(let i = 0; i < data.length; i++){
            if(data[i].slug === slug){
              console.log("Found valid game instance");
              setGameInstance(data[i]);
              setGameId(Number(data[i].game));
              break;
            }
          }
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
  }, [slug, setFirstRequestDone, setGameInstance]);

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

  const startListener = (message) => {
    console.log(message);
  }

  useEffect(() => {
    if(!socket && slug){
      const url = `${process.env.REACT_APP_SOCKET_ENDPOINT}gameinstance/${slug}`;
      const newClient = new WebSocketClient(`${process.env.REACT_APP_SOCKET_ENDPOINT}gameinstance/${slug}`);
      setSocket(newSocket);
    }
    if(!firstRequestDone && userContext.access && socket){
      socket.on("message_trigger", startListener);
      removeCookies("refresh", {path:"/game"});
      removeCookies("user", {path:"/game"});
      removeCookies("username", {path:"/game"});

      if(slug){
        getGameInstance();
        if(gameId){
          getGame();
        }
      }
    }
    if(userContext.access && game && !questionRequestDone){getQuestions();}
    if(socket){
      return () => socket.close();
    }
  }, [game, getGame, getQuestions, userContext, questionRequestDone, firstRequestDone, removeCookies, slug, socket, setSocket]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-auto pb-10">
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
            {/* TODO: use slug instead of instance id */}
            <input disabled className="w-3/5 h-10 text-lg" id="instanceInput" type="text" placeholder="Title" maxlength="255" value={gameInstance ? gameInstance.id: ""}></input>
            <label className="text-aliceBlue mr-2" htmlFor="gameTitleInput">Title</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameTitleInput" type="text" placeholder="Title" maxlength="255" value={game ? game.name: ""}></input>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="gameDescriptionText">Description</label>
            <textarea disabled className="w-3/5 h-1/3 p-2" id="gameDescriptionText" placeholder="Description" value={game ? game.description : ""}></textarea>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="categorySelect">Category</label>
            <input disabled className="w-3/5 h-10 text-lg" id="gameCategoryText" type="text" value={game ? game.category : ""}></input>
            <label className="text-aliceBlue mr-2" htmlFor="instanceHost">Host</label>
            <input disabled className="w-3/5 h-10 text-lg" id="instanceHost" type="text" placeholder="Title" maxlength="255" value={gameInstance ? gameInstance.creator: ""}></input>
            {gameInstance && Number(gameInstance.creator) === Number(cookies.user) && <div className="flex w-full items-center justify-center">
              <button className=" transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-4 rounded-md self-center mr-2 hover:bg-gray-300 disabled:opacity-50"
                onClick={(e) => {history.push(`/play/${gameId}`); e.preventDefault();}} title={userContext.access ? null : "Log in to play"}>
                Start
              </button>
            </div>}
          </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-3/5 h-screen bg-manatee rounded-lg mt-10">
        <div className="h-16 bg-imperialRed">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Chat</h1>
        </div>
      </div>
    </div>
  );
}

export default GameLobby;