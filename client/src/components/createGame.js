import React, { useContext, useState } from "react"
import { useCookies } from "react-cookie"
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router";

const CreateGame = () => {
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies(['token']);
  const [idCookie, setIdCookie, removeIdCookie] = useCookies(['user']);
  const [error, setError] = useState("")
  const [gameId, setGameId] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [gameDetailsCollapsed, setGameDetailsCollapsed] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const history = useHistory();

  const addQuestion = () => {
    let questionData = {
      questionText: document.getElementById("questionTextArea").value,
      type: questionType,
      game: gameId,
      answers: []
    }
    if(!questionData.questionText || !questionType){return;}
    if(questionType === "trueFalse"){
      questionData.answers.push({
        text: "True",
        correct: document.getElementById("trueFalseAnswerSelect").value === "true",
      });
      questionData.answers.push({
        text: "False",
        correct: document.getElementById("trueFalseAnswerSelect").value === "false",
      });
    }
    else{
      for(let i = 1; i < 5; i++){
        if(document.getElementById(`mcInput${i}`).value){
          let answer = {
            text: document.getElementById(`mcInput${i}`).value,
            correct: document.getElementById(`mcRadio${i}`).checked
          }
          questionData.answers.push(answer);
        }
      }
    }
    if(questionData.answers.length < 2){return;}
    setQuestions([...questions, questionData]);
  }

  const clearGame = () => {
    setGameId(null);
    setQuestions([]);
    document.getElementById("gameTitleInput").value = "";
    document.getElementById("gameDescriptionText").value = "";
    document.getElementById("questionTextArea").value = "";
    document.getElementById("typeSelectBlank").selected = true;
    setQuestionType("");
  }

  const gameDetailsCollapseButtonToggle = () => {
    let button = document.getElementById("gameDetailsCollapseButton");
    button.innerText = gameDetailsCollapsed ? "^" : "v"
    setGameDetailsCollapsed(!gameDetailsCollapsed);
  }

  const removeQuestion = (i) => {
    let newQuestions = [...questions];
    newQuestions.splice(i,1);
    setQuestions(newQuestions);
  }

  const submitGame = async() => {
    let gameData = {
      name: document.getElementById("gameTitleInput").value,
      description: document.getElementById("gameDescriptionText").value,
      category: document.getElementById("categorySelect").value,
      creator: idCookie.user,
    }
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch("http://localhost:8000/api/games/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
      body: JSON.stringify(gameData),
    })
      .then(async response => {
        //setIsSubmitting(false)
        if (!response.ok) {
            let data = await response.json();
            setError(data.description[0] || data.name[0] || data.category[0] || data.creator[0] || data.image[0] || genericErrorMessage);
        } else {
          let data = await response.json();
          setGameId(data.id);
          setGameDetails(data);
          setError("");
        }
      })
      .catch(error => {
        //setIsSubmitting(false)
        setError(genericErrorMessage)
      })
  }

  const submitQuestions = async(question) => {
    let gameData = {
      name: document.getElementById("gameTitleInput").value,
      description: document.getElementById("gameDescriptionText").value,
      category: document.getElementById("categorySelect").value,
      creator: idCookie.user,
    }
    const genericErrorMessage = "Something went wrong! Please try again later.";
    console.log(questions);
    fetch("http://localhost:8000/api/games/" + gameId + "/questions/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
      body: JSON.stringify(question),
    })
      .then(async response => {
        //setIsSubmitting(false)
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
            setError(data.description[0] || data.name[0] || data.category[0] || data.creator[0] || data.image[0] || genericErrorMessage);
        } else {
          let data = await response.json();
          console.log(data);
          setError("");
          history.push(`/game/${gameId}`)
        }
      })
      .catch(error => {
        //setIsSubmitting(false)
        setError(genericErrorMessage)
      });
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-auto">
      <div className={gameDetailsCollapsed ? "transition-all duration-300 flex flex-col w-4/5 h-0 bg-manatee rounded-b-lg" :
        "transition-all duration-300 flex flex-col w-4/5 h-2/5 bg-manatee rounded-b-lg"}>
        <div className="h-16 bg-imperialRed overflow-hidden">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Create A Game</h1>
        </div>
        <div className="flex flex-col h-full w-full">
        {error && <h1 className="mt-4 text-lg text-red-600">{error}</h1>}
          <form id="gameDetailsForm" className={`flex flex-col h-full w-full justify-start items-center pt-2 ${gameDetailsCollapsed ? "hidden" : ""}`}>
            <input readOnly={gameId !== null} className="w-3/5 h-10 text-lg" id="gameTitleInput" type="text" placeholder="Title" maxlength="255"></input>
            <textarea readOnly={gameId !== null} className="w-3/5 h-1/3 mt-5 p-2" id="gameDescriptionText" placeholder="Description"></textarea>
            {/* <fieldset className="flex flex-row w-3/5 my-4 border-2 border-aliceBlue rounded-md">
              <label className="text-spaceCadet mt-4 mr-2" htmlFor="gameImageUpload">Choose an image for the game (optional):</label>
              <input className="text-spaceCadet self-center my-2" id="gameImageUpload" name="gameImageUpload" type="file"/>
            </fieldset> */}
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="categorySelect">Category</label>
            <select disabled={gameId !== null} id="categorySelect" name="categorySelect" className="w-2/5 rounded-md text-lg">
              <option value="science">Science</option>
              <option value="art">Art</option>
              <option value="comics">Comics</option>
              <option value="animation">Animation</option>
              <option value="tv-movies">TV/Movies</option>
              <option value="other">Other</option>
            </select>
            <div className="flex w-full items-center justify-center">
              <button hidden={gameId !== null} className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-4 rounded-md self-center hover:bg-gray-300 mr-2"
                onClick={(e) => {submitGame(); e.preventDefault();}}>
                Submit
              </button>
              <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 my-4 rounded-md self-center hover:bg-gray-300 ml-2"
                onClick={(e) => {clearGame(); e.preventDefault();}}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex w-11 border-1 border-black rounded-b-md bg-manatee h-8 items-center justify-center">
          <button id="gameDetailsCollapseButton" className="h-full w-full text-2xl text-aliceBlue" onClick={gameDetailsCollapseButtonToggle}>
            {'^'}
          </button>
        </div>
      <div id="createQuestionsDiv" className={ gameId ? "transition-all duration-500 flex flex-col w-4/5 h-screen bg-manatee rounded-lg my-4 overflow-auto items-center pt-24" :
        "transition-all duration-500 flex flex-col w-4/5 h-0 bg-manatee rounded-lg my-4 overflow-auto"}>
        <div className="h-16 bg-imperialRed overflow-hidden w-full mb-2">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Add Question</h1>
        </div>
        <form id="questionEntryForm" className="flex flex-col h-full w-full justify-center items-center">
          <span className="flex flex-row w-full justify-center">
            <h2 className="mr-4 text-lg">{questions.length+1}</h2>
            <textarea id="questionTextArea" className="w-11/12 rounded-md p-1" placeholder="Question Text"></textarea>
          </span>
          <label className="text-aliceBlue mt-4 mr-2 text-lg" htmlFor="questionTypeSelect">Category</label>
          <select id="questionTypeSelect" name="questionTypeSelect" className="w-2/5 h-8 text-md mt-1 rounded-md" onChange={(e) => {setQuestionType(e.target.value);}}>
              <option id="typeSelectBlank" value=""> </option>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="trueFalse">True or False</option>
          </select>
          {questionType && <h2 className="text-aliceBlue mt-2 text-lg">Answers</h2>}
          {questionType === "trueFalse" &&
            <div className="flex items-center justify-center border-2 border-spaceCadet rounded-md px-4 py-2">
              <select id="trueFalseAnswerSelect" className="text-lg">
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          }
          {questionType === "multipleChoice" &&
            <div className="flex flex-col items-center justify-center border-2 border-spaceCadet rounded-md px-4 py-2 w-4/5">
              <h2 className="text-lg mb-4">Select the radio button of the correct answer. Questions must have at least 2 possible choices.</h2>
              <span className="w-full mb-4">
                <input type="text" id="mcInput1" className="w-4/5 h-10 text-lg" placeholder="Choice 1"></input>
                <input type="radio" id="mcRadio1" name="mcCorrectAnswer" className="ml-4" checked></input>
              </span>
              <span className="w-full mb-4">
                <input type="text" id="mcInput2" className="w-4/5 h-10 text-lg" placeholder="Choice 2"></input>
                <input type="radio" id="mcRadio2" name="mcCorrectAnswer" className="ml-4"></input>
              </span>
              <span className="w-full mb-4">
                <input type="text" id="mcInput3" className="w-4/5 h-10 text-lg" placeholder="Choice 3"></input>
                <input type="radio" id="mcRadio3" name="mcCorrectAnswer" className="ml-4"></input>
              </span>
              <span className="w-full">
                <input type="text" id="mcInput4" className="w-4/5 h-10 text-lg" placeholder="Choice 4"></input>
                <input type="radio" id="mcRadio4" name="mcCorrectAnswer" className="ml-4"></input>
              </span>
            </div>
          }
          {questionType &&
            <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 mt-10 mb-4 rounded-md self-center hover:bg-gray-300 mr-2" onClick={(e) => {addQuestion(); e.preventDefault();}}>
              Add
            </button>
          }
        </form>
      </div>
      { questions.length > 0 &&
      <div id="currentQuestionsDiv" className={ gameId ? "transition-all duration-500 flex flex-col w-4/5 h-full bg-manatee rounded-lg my-4 overflow-auto items-center overflow-auto" :
      "transition-all duration-500 flex flex-col w-4/5 h-0 bg-manatee rounded-lg my-4 overflow-auto"}>
        <div className="h-16 bg-imperialRed overflow-hidden w-full mb-2">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Questions</h1>
        </div>
        {questions && questions.map((q,i) => {
          return (
              <form id={`currentQuestionsForm${i}`} className="flex flex-col h-full w-11/12 justify-center items-center border-2 rounded-md py-2 my-2">
                <span className="flex flex-row w-full justify-center">
                  <h2 className="mr-4 text-lg">{i+1}</h2>
                  <textarea readOnly id={`currentQuestionTextArea${i}`} className="w-11/12 rounded-md p-1" placeholder="Question Text" value={q.questionText}></textarea>
                </span>
                <label className="text-aliceBlue mt-4 mr-2 text-lg" htmlFor="questionTypeSelect">Category</label>
                <select disabled id="questionTypeSelect" name="questionTypeSelect" className="w-2/5 h-8 text-md mt-1 rounded-md" onChange={(e) => {setQuestionType(e.target.value);}}>
                    <option selected={q.questionType === "multipleChoice" ? true: false} value="multipleChoice">Multiple Choice</option>
                    <option selected={q.questionType === "trueFalse" ? true: false} value="trueFalse">True or False</option>
                </select>
                <h2 className="text-aliceBlue mt-2 text-lg">Answer</h2>
                {q.questionType === "trueFalse" &&
                  <div className="flex items-center justify-center border-2 border-spaceCadet rounded-md px-4 py-2">
                    <select id="trueFalseAnswerSelect" className="text-lg">
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                }
                <button className="transition-all duration-300 bg-aliceBlue w-1/5 h-8 mt-10 mb-4 rounded-md self-center hover:bg-gray-300 mr-2" onClick={(e) => { removeQuestion(i); e.preventDefault(); }}>
                  Remove
                </button>
              </form>
          );
        })}
      </div>
      }
      {questions.length >= 3 && 
        <button className="transition-all duration-300 text-xl border-2 border-spaceCadet bg-aliceBlue w-1/5 h-10 mt-2 mb-10 rounded-md self-center hover:bg-gray-300 mr-2"
          onClick={(e) => {
            for(let i = 0; i < questions.length; i++){
              submitQuestions(questions[i]);
            }
            e.preventDefault();
            }}>
          Submit 
        </button>
      }
    </div>
  );
}

export default CreateGame