import React, { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext"

const Register = (props) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const formSubmitHandler = e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email: email, password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
            setError(genericErrorMessage)
            console.log(await response.json());
        } else {
          const data = await response.json()
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token }
          })
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(genericErrorMessage)
      })
  }

  return(<div>
    <form onSubmit={formSubmitHandler}>
      {error && <h1>{error}</h1>}
      <input
            id="username"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
          <input
            id="email"
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <input
            id="password"
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
      <button intent="primary" text="Register" fill type="submit" disabled={isSubmitting}>
            {`${isSubmitting ? "Registering" : "Register"}`}
      </button>
    </form>
  </div>);
}

export default Register;