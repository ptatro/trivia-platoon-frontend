import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory, useParams } from "react-router";
import { UserContext } from "../context/UserContext"
import { useCookies } from "react-cookie"

const Profile = (props) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [idCookie, setIdCookie, removeIdCookie] = useCookies(['user']);
  const { profileUserId } = useParams();
  const [games, setGames] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const history = useHistory();

  const getUserGames = async() => {
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games?creator=${profileUserId}`, {
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
            setFirstRequestDone(true);
            setTimeout(getUserGames, 1 * 60 * 1000);
        } else {
          let data = await response.json();
          setGames(data);
          setError("");
          setFirstRequestDone(true);
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
        console.log(error);
        setFirstRequestDone(true);
        setTimeout(getUserGames, 1 * 60 * 1000);
      })
  }

  const deleteGame = async(game) => {
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${game.id}/`, {
      method: "DELETE",
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
        } else {
          getUserGames();
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
        console.log(error);
      })
  }
  useEffect(() => {
    if(!firstRequestDone){
      getUserGames();
    }
  }, [games, getUserGames, firstRequestDone]);


  return (<div className="transition-all flex flex-col w-full h-full items-center">
    {/* Profile banner */}
    <div className="flex flex-col w-4/5 h-auto bg-manatee rounded-b-lg">
      <div className="h-16 bg-imperialRed overflow-hidden">
        <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Profile</h1>
      </div>
    </div>
    {/* Game list */}
    <div className="flex flex-col w-4/5 h-3/5 bg-manatee rounded-lg mt-10 items-center overflow-auto">
      <div className="h-16 w-full bg-imperialRed overflow-hidden justify-center"><h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Game List</h1></div>
      <div className="h-full w-full flex flex-col items-center overflow-auto">
        {!games && firstRequestDone && 
        <h2>This user doesn't have any games created.</h2>}
        {games && games.map((g,i) => {
        return <div className="transition-all h-11/12 w-11/12 grid grid-cols-4 bg-aliceBlue rounded-md mt-4 hover:bg-gray-400" onClick={() => {
          let newGames = games.slice();
          for(let gNum = 0; gNum < newGames.length; gNum++){
            newGames[gNum].expand = false;
          }
          newGames[i].expand = newGames[i].expand = newGames[i].expand ? false : true;
          setGames(newGames);
          }}>
          <h2 className="justify-self-start ml-5 text-xl">{i + 1}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{g.name}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{g.category}</h2>
          <h2 className="justify-self-start ml-5 text-xl">{g.rating_count ? Number(g.rating_total)/Number(g.rating_count) : "No Ratings"}</h2>
          {g.expand &&
          <div className="flex-row w-full col-span-4">
            <button className=" transition-all duration-300 bg-gray-400 w-1/4 h-8 my-4 rounded-md self-center mr-2 hover:bg-gray-300 disabled:opacity-50" onClick={() => history.push(`/game/${g.id}/`)}>
              Play</button>
            <button className=" transition-all duration-300 bg-gray-400 w-1/4 h-8 my-4 rounded-md self-center mr-2 hover:bg-gray-300 disabled:opacity-50" onClick={() => history.push(`/edit/${g.id}/`)}>
              Edit</button>
            <button className=" transition-all duration-300 bg-gray-400 w-1/4 h-8 my-4 rounded-md self-center mr-2 hover:bg-gray-300 disabled:opacity-50" onClick={() => deleteGame(g)}>
              Delete</button>
          </div>
          }
        </div>
        })}
      </div>
    </div>
  </div>);
}

export default Profile;