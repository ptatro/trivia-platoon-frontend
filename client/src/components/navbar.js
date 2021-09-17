import React, { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext"

const Navbar = (props) => {
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const collapseButtonToggle = () => {
    let button = document.getElementById("collapseButton");
    button.innerText = isCollapsed ? "<<" : ">>"
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="flex flex-row h-full w-1/6 items-center">
      <nav className={isCollapsed ? "transition-all ease-out duration-500 flex flex-col items-center h-full w-0 bg-spaceCadet pb-20" :
       "transition-all ease-out duration-500 flex flex-col items-center h-full w-full bg-spaceCadet pb-20"}>
        <div className="transition-all ease-out duration-400 flex w-full h-16 bg-amaranthRed mb-5 items-center justify-center overflow-hidden">
         <h1 className={ isCollapsed ? "transition-all duration-150 text-aliceBlue text-md opacity-0 md:text-3xl" :
         "transition-all duration-700 text-aliceBlue text-md overflow-hidden opacity-100 md:text-3xl"}>Trivia Platoon</h1>
        </div>
        <Link to="/" className="text-aliceBlue hover:text-gray-400">Home</Link>
        {userContext.token && <Link to="/" className="text-aliceBlue hover:text-gray-400 mt-5">Profile</Link>}
        <Link to="/" className="text-aliceBlue hover:text-gray-400 mt-5">Leaderboards</Link>
        {userContext.token && <Link to="/" className="text-aliceBlue hover:text-gray-400 mt-5">Create a game</Link>}
        {!userContext.token && <Link to="/login" className="text-aliceBlue hover:text-gray-400 mt-5">Log In</Link>}
        {!userContext.token && <Link to="/register" className="text-aliceBlue hover:text-gray-400 mt-5">Register</Link>}
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