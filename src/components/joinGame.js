import React, { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { useCookies } from "react-cookie"

const JoinGame = () => {
  const [userContext, setUserContext] = useContext(UserContext); // eslint-disable-line
  const [joinCode, setJoinCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [cookies, setCookie, removeCookie] = useCookies(['refresh', 'user', 'username']); // eslint-disable-line

  const formSubmitHandler = e => {
    e.preventDefault();
    console.log("Submit");
    return;
    setIsSubmitting(true);
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}join/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          let data = await response.json();
            setError(data.detail || genericErrorMessage)
            console.log(data);
        } else {
          const data = await response.json(); // eslint-disable-line

        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(genericErrorMessage)
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