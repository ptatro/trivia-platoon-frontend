import React, { useState } from "react"
import { useHistory } from "react-router";

const Register = (props) => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const formSubmitHandler = e => {
    e.preventDefault();
    if(!checkPasswordMatch()){return;}
    setIsSubmitting(true)
    setError("")
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email: email, password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
            let data = await response.json();
            setError((data.username && data.username[0]) || (data.email && data.email[0]) || (data.password && data.password[0]) || genericErrorMessage);
            console.log(data);
        } else {
          history.push("/login");
        }
      })
      .catch(error => {
        console.log(error);
        setIsSubmitting(false)
        setError(genericErrorMessage)
      })
  }

  const checkPasswordMatch = () => {
    if(passwordConfirm !== password){
      setError("Passwords do not match.");
      console.log(passwordConfirm);
      console.log(password);
      return false;
    }
    else{
      setError("");
      return true;
    }
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
            id="email"
            className="mt-4 h-10"
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          <input
            id="password"
            className="mt-4 h-10"
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
          <input
            id="passwordConfirm"
            className="mt-4 h-10"
            placeholder="Confirm Password"
            type="password"
            onChange={e => {setPasswordConfirm(e.target.value);}}
            value={passwordConfirm}
          />      <button className="transition-all duration-300 mt-4 border-2 rounded-md border-gray-400 hover:bg-gray-300" intent="primary" text="Register" type="submit" disabled={isSubmitting}>
            {`${isSubmitting ? "Registering" : "Register"}`}
      </button>
    </form>
  </div>);
}

export default Register;