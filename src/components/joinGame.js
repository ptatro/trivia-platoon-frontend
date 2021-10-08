import React, { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { useCookies } from "react-cookie"
import { useHistory } from "react-router";

const JoinGame = () => {
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext); // eslint-disable-line
  const [joinCode, setJoinCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [cookies, setCookie, removeCookie] = useCookies(['refresh', 'user', 'username']); // eslint-disable-line

  //Temporarily getting game instance by ID
  //TODO: get instance by slug
  const formSubmitHandler = e => {
    e.preventDefault();
    console.log(joinCode);
    setIsSubmitting(true);
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
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
        } else {
          let data = await response.json();
          //Temporary loop, until we can get instance by slug
          //TODO: use gameinstances slug route
          let slug;
          console.log(data);
          for(let i = 0; i < data.length; i++){
            
            if(Number(data[i].id) === Number(joinCode)){
              slug = data[i].slug;
              break;
            }
          }
          if(slug){
            setError("");
            history.push(`/lobby/${slug}`);
          }
          else{
            setError("No valid game instances.")
          }
          setIsSubmitting(false);
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
        console.log(error);
      })
  }

  return(<div className="w-full h-1/2 flex items-center justify-center">
    <form className="flex flex-col w-1/4 border-2 rounded-md p-4" onSubmit={formSubmitHandler}>
      <h1>Enter Invite Code:</h1>
      {error && <h1>{error}</h1>}
      <input
            id="joinCode"
            className="mt-4 h-10"
            placeholder="Code"
            onChange={e => setJoinCode(e.target.value)}
            value={joinCode}
          />
      <button className="transition-all duration-300 mt-4 border-2 rounded-md border-gray-400 hover:bg-gray-300" intent="primary" text="Login" type="submit" disabled={isSubmitting}>
            {`${isSubmitting ? "Submitting" : "Submit"}`}
      </button>
    </form>
  </div>);

}


export default JoinGame;