import React, { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext"
import { useCookies } from "react-cookie"
import jwt_decode from "jwt-decode";
const Login = () => {
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [cookies, setCookie, removeCookie] = useCookies(['refresh', 'user', 'username']);

  const formSubmitHandler = e => {
    
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}auth/token/obtain/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          let data = await response.json();
            setError(data.detail || genericErrorMessage)
            console.log(data);
        } else {
          const data = await response.json();
          let user_id = jwt_decode(data.access).user_id;
          setCookie("refresh", data.refresh, {path:"/"});
          setCookie("user", user_id, {path:"/"});
          setCookie("username", username, {path:"/"});
          setUserContext((oldContext) => {return {...oldContext, access:data.access}});
          history.push("/");
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(genericErrorMessage)
      })
  }

  return(<div className="w-full h-1/2 flex items-center justify-center">
    <form className="flex flex-col w-1/4 border-2 rounded-md p-4" onSubmit={formSubmitHandler}>
      {error && <h1>{error}</h1>}
      <input
            id="username"
            className="mt-4 h-10"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
          <input
            id="password"
            className="mt-4 h-10"
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
      <button className="transition-all duration-300 mt-4 border-2 rounded-md border-gray-400 hover:bg-gray-300" intent="primary" text="Login" type="submit" disabled={isSubmitting}>
            {`${isSubmitting ? "Logging in" : "Log In"}`}
      </button>
    </form>
  </div>);

}


export default Login;