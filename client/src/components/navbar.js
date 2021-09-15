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
    <div className="flex flex-row h-full w-1/5 items-center">
      <nav className={isCollapsed ? "flex flex-col items-center h-full w-0 bg-spaceCadet py-20" :
       "flex flex-col items-center h-full w-full bg-spaceCadet py-20"}>
        <Link className="text-aliceBlue hover:text-gray-400">Home</Link>
        <Link className="text-aliceBlue hover:text-gray-400 mt-5">Profile</Link>
        <Link className="text-aliceBlue hover:text-gray-400 mt-5">Leaderboards</Link>
      </nav>
      <div className="flex h-11 border-1 border-black rounded-r-md bg-manatee w-8 items-center justify-center">
        <button id="collapseButton" className="text-2xl text-aliceBlue" onClick={collapseButtonToggle}>
          {'<<'}
        </button>
      </div>
    </div>
  );
}

export default Navbar;