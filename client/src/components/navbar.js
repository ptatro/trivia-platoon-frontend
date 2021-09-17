import React, { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

const Navbar = (props) => {
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapseButtonToggle = () => {
    let button = document.getElementById("collapseButton");
    button.innerText = isCollapsed ? "<<" : ">>"
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="flex flex-row h-full w-1/6 items-center">
      <nav className={isCollapsed ? "transition-all ease-out duration-500 flex flex-col items-center h-full w-0 bg-spaceCadet pb-20" :
       "transition-all ease-out duration-500 flex flex-col items-center h-full w-full bg-spaceCadet pb-20"}>
        <div className="transition-all ease-out duration-400 flex w-full h-14 bg-amaranthRed mb-5 items-center justify-center overflow-hidden">
         <h1 className={ isCollapsed ? "transition-all duration-150 text-aliceBlue text-3xl opacity-0" :
         "transition-all duration-700 text-aliceBlue text-3xl overflow-hidden opacity-100"}>Trivia Platoon</h1>
        </div>
        <Link className="text-aliceBlue hover:text-gray-400">Home</Link>
        <Link className="text-aliceBlue hover:text-gray-400 mt-5">Profile</Link>
        <Link className="text-aliceBlue hover:text-gray-400 mt-5">Leaderboards</Link>
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