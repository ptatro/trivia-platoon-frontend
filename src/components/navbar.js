import React, { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext"
import { useCookies } from "react-cookie"

const Navbar = (props) => {
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const [cookies, setCookies, removeCookies] = useCookies(['refresh', 'user', 'username']);
  const collapseButtonToggle = () => {
    let button = document.getElementById("collapseButton");
    button.innerText = isCollapsed ? "<<" : ">>"
    setIsCollapsed(!isCollapsed);
  }

  const logOutHandler = async () => {
    removeCookies("refresh", {path:"/"});
    removeCookies("user", {path:"/"});
    removeCookies("username", {path:"/"});
    history.push("/");
  }

  return (
    <div className={isCollapsed ? "transition-all ease-out duration-500 flex flex-row h-full w-8 items-center" :
    "transition-all ease-out duration-500 flex flex-row h-full w-full items-center md:w-1/6"}>
      <nav className={isCollapsed ? "transition-all ease-out duration-500 flex flex-col items-center h-full w-0 bg-spaceCadet pb-20" :
       "transition-all ease-out duration-500 flex flex-col items-center h-full w-full bg-spaceCadet pb-20"}>
        <div className="transition-all ease-out duration-400 flex w-full h-16 bg-amaranthRed mb-5 items-center justify-center overflow-hidden">
         <h1 className={ isCollapsed ? "transition-all duration-150 text-aliceBlue text-md opacity-0 md:text-3xl" :
         "transition-all duration-700 text-aliceBlue text-md overflow-hidden opacity-100 md:text-3xl"}>Trivia Platoon</h1>
        </div>
        <Link to="/" className="text-aliceBlue hover:text-gray-400">Home</Link>
        {cookies.user && <Link to={`/profile/${cookies.user}`} className="text-aliceBlue hover:text-gray-400 mt-5">Profile</Link>}
        {/* <Link to="/" className="text-aliceBlue hover:text-gray-400 mt-5">Leaderboards</Link> */}
        {cookies.refresh && <Link to="/creategame" className="text-aliceBlue hover:text-gray-400 mt-5">Create a game</Link>}
        {!cookies.refresh && <Link to="/login" className="text-aliceBlue hover:text-gray-400 mt-5">Log In</Link>}
        {!cookies.refresh && <Link to="/register" className="text-aliceBlue hover:text-gray-400 mt-5">Register</Link>}
        {cookies.username && <h2 className="text-aliceBlue mt-16">Logged in as: {cookies.username}</h2>}
        {cookies.refresh && <button to="/" className="text-aliceBlue hover:text-gray-400 mt-5" onClick={logOutHandler}>Log Out</button>}
      </nav>
      <div className="flex h-11 border-1 border-black rounded-r-md bg-manatee w-8 items-center justify-center">
        <button id="collapseButton" className="h-full w-full text-xl text-aliceBlue" onClick={collapseButtonToggle}>
          {'<<'}
        </button>
      </div>
    </div>
  );
}

export default Navbar;