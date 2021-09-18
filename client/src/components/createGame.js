import React, { useContext, useState } from "react"

const CreateGame = () => {

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <div className="flex flex-col w-4/5 h-3/6 bg-manatee rounded-b-lg">
        <div className="h-16 bg-imperialRed overflow-hidden">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Create A Game</h1>
        </div>
        <div className="flex flex-col h-full w-full">
          <form id="gameDetailsForm" className="flex flex-col h-full w-full justify-center items-center">
            <input className="w-3/5 h-10 text-lg" type="text" placeholder="Title" maxlength="255"></input>
            <textarea className="w-3/5 h-1/3 mt-5 p-2" id="gameDescriptionText" placeholder="Description"></textarea>
            <fieldset className="flex flex-row w-3/5 my-4 border-2 border-aliceBlue rounded-md">
              <label className="text-spaceCadet mt-4 mr-2" htmlFor="gameImageUpload">Choose an image for the game (optional):</label>
              <input className="text-spaceCadet self-center my-2" id="gameImageUpload" name="gameImageUpload" type="file"/>
            </fieldset>
            <select id="categorySelect" className="w-2/5">
              <option value="science">Science</option>
              <option value="art">Art</option>
              <option value="comics">Comics</option>
              <option value="animation">Animation</option>
              <option value="tv-movies">TV/Movies</option>
              <option value="other">Other</option>
            </select>
            <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-2 rounded-md self-center hover:bg-gray-300">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGame