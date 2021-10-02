import React, { useContext, useState, useEffect, useCallback } from "react"
import { useCookies } from "react-cookie"
import { UserContext } from "../context/UserContext";
import { useHistory, useParams } from "react-router";

const EditGame = () => {
  const [firstRequestDone, setFirstRequestDone] = useState(false);
  const [questionRequestDone, setQuestionRequestDone] = useState(false);
  const [game, setGame] = useState(null);
  const [idCookie, setIdCookie, removeIdCookie] = useCookies(['user']); // eslint-disable-line
  const [error, setError] = useState("")
  const {gameId} = useParams();
  const [gameDetails, setGameDetails] = useState(null); // eslint-disable-line
  const [questions, setQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [gameDetailsCollapsed, setGameDetailsCollapsed] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext); // eslint-disable-line
  const history = useHistory();
  const genericErrorMessage = "Something went wrong! Please try again later.";

  const getGame = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
            setError(genericErrorMessage);
        } else {
          let data = await response.json();
          setGame(data);
          setError("");
        }
        setFirstRequestDone(true);
      })
      .catch(error => {
        setError(error);
        setFirstRequestDone(true);
      })
  },[setFirstRequestDone, gameId]);

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
    clearQuestionFields();
    setNewQuestions([...newQuestions, questionData]);
  }

  const deleteOldQuestion = (q) => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${game.id}/questions/${q.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            setError(genericErrorMessage);
            console.log(data);
        }})
      .catch(error => {
        setError(genericErrorMessage)
        console.log(error);
      })
  }

  const clearQuestionFields = () => {
    document.getElementById("questionTextArea").value = "";
    if(questionType === "multipleChoice"){
      document.getElementById("mcInput1").value = "";
      document.getElementById("mcInput2").value = "";
      document.getElementById("mcInput3").value = "";
      document.getElementById("mcInput4").value = "";
    }
  }

  const gameDetailsCollapseButtonToggle = () => {
    let button = document.getElementById("gameDetailsCollapseButton");
    button.innerText = gameDetailsCollapsed ? "^" : "v"
    setGameDetailsCollapsed(!gameDetailsCollapsed);
  }

  const removeQuestion = (i) => {
    let questionsRemoved = [...newQuestions];
    questionsRemoved.splice(i,1);
    setNewQuestions(questionsRemoved);
  }

  const submitGame = async() => {
    let formData = new FormData();
    formData.append("name", document.getElementById("gameTitleInput").value);
    formData.append("description", document.getElementById("gameDescriptionText").value);
    formData.append("category", document.getElementById("categorySelect").value);
    formData.append("creator", idCookie.user);


    if(document.getElementById("gameImageUpload").files[0]){
      formData.append("image", document.getElementById("gameImageUpload").files[0]);
    }
    const genericErrorMessage = "Something went wrong! Please try again later."
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Authorization": `JWT ${userContext.access}`
      },
      body: formData,
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
            setError(data.description[0] || data.name[0] || data.category[0] || data.creator[0] || data.image[0] || genericErrorMessage);
        } else {
          let data = await response.json();
          setGameDetails(data);
          setError("");
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
      })
  }

  const getQuestions = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/questions/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
            setError(genericErrorMessage);
        } else {
          let data = await response.json();
          console.log(data);
          setQuestions(data);
          setNewQuestions(data);
          setError("");
        }
        setQuestionRequestDone(true);
      })
      .catch(error => {
        setError(genericErrorMessage);
        setQuestionRequestDone(true);
      })
  }, [setNewQuestions, setQuestionRequestDone, gameId, userContext]);

  const submitQuestions = async(question) => {
    const genericErrorMessage = "Something went wrong! Please try again later.";
    fetch(`${process.env.REACT_APP_API_ENDPOINT}api/games/${gameId}/questions/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${userContext.access}`
      },
      body: JSON.stringify(question),
    })
      .then(async response => {
        if (!response.ok) {
            let data = await response.json();
            console.log(data);
            setError(data.description[0] || data.name[0] || data.category[0] || data.creator[0] || data.image[0] || genericErrorMessage);
        } else {
          setError("");
          history.push(`/game/${gameId}`)
        }
      })
      .catch(error => {
        setError(genericErrorMessage)
      });
  }

  useEffect(() => {
    if(!firstRequestDone){
      getGame();
      if(game && userContext.access && !questionRequestDone){
        getQuestions();
      }
    }
  }, [game, getGame, getQuestions, userContext, questionRequestDone, firstRequestDone]);


  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-auto">
      <div className={gameDetailsCollapsed ? "transition-all duration-300 flex flex-col w-4/5 h-0 bg-manatee rounded-b-lg" :
        "transition-all duration-300 flex flex-col w-4/5 h-auto bg-manatee rounded-b-lg"}>
        <div className="flex h-auto bg-imperialRed overflow-hidden items-center justify-center">
          <h1 className="text-md text-aliceBlue my-2 lg:text-3xl md:text-2xl">Edit Game</h1>
        </div>
        <div className="flex flex-col h-full w-full">
        {error && <h1 className="mt-4 text-lg text-red-600">{error}</h1>}
        <div className="flex flex-row w-full">
        {game && <img className="rounded-md m-2 max-w-sm" alt="game" src={game.image}></img>}
          <form id="gameDetailsForm" className={`flex flex-col h-full w-full justify-start items-center pt-2 ${gameDetailsCollapsed ? "hidden" : ""}`}>
            <input className="w-3/5 h-10 text-lg" id="gameTitleInput" type="text" placeholder="Title" maxlength="255" defaultValue={game ? game.name : ""}></input>
            <textarea className="w-3/5 h-1/3 mt-5 p-2" id="gameDescriptionText" placeholder="Description" defaultValue={game ? game.description : ""}></textarea>
            <fieldset className="flex flex-row w-3/5 my-4 border-2 border-aliceBlue rounded-md">
              <label className="text-spaceCadet mt-4 mr-2" htmlFor="gameImageUpload">Choose an image for the game (optional):</label>
              <input className="text-spaceCadet self-center my-2" id="gameImageUpload" name="gameImageUpload" type="file"/>
            </fieldset>
            <label className="text-aliceBlue mt-4 mr-2" htmlFor="categorySelect" defaultValue={game ? game.category : ""}>Category</label>
            <select id="categorySelect" name="categorySelect" className="w-2/5 rounded-md text-lg">
              <option value="science">Science</option>
              <option value="art">Art</option>
              <option value="comics">Comics</option>
              <option value="animation">Animation</option>
              <option value="tv-movies">TV/Movies</option>
              <option value="other">Other</option>
            </select>
          </form>
        </div>
        </div>
      </div>
      <div className="flex w-11 border-1 border-black rounded-b-md bg-manatee h-8 items-center justify-center">
          <button id="gameDetailsCollapseButton" className="h-full w-full text-2xl text-aliceBlue" onClick={gameDetailsCollapseButtonToggle}>
            {'^'}
          </button>
        </div>
      <div id="createQuestionsDiv" className={ gameId ? "transition-all duration-500 flex flex-col w-4/5 h-auto bg-manatee rounded-lg my-4 items-center" :
        "transition-all duration-500 flex flex-col w-4/5 h-0 bg-manatee rounded-lg my-4 overflow-auto"}>
        <div className="h-16 bg-imperialRed w-full mb-2">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Add Question</h1>
        </div>
        <form id="questionEntryForm" className="flex flex-col h-auto w-11/12 justify-center items-center border-2 rounded-md py-2 my-2">
          <span className="flex flex-row w-full justify-center">
            <h2 className="mr-4 text-lg">{newQuestions.length+1}</h2>
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
      { newQuestions.length > 0 &&
      <div id="currentQuestionsDiv" className={ gameId ? "transition-all duration-500 flex flex-col w-4/5 h-auto bg-manatee rounded-lg my-4 items-center" :
      "transition-all duration-500 flex flex-col w-4/5 h-0 bg-manatee rounded-lg my-4 overflow-auto"}>
        <div className="h-16 bg-imperialRed w-full mb-2">
          <h1 className="text-md text-aliceBlue mt-4 lg:text-3xl md:text-2xl">Questions</h1>
        </div>
        {newQuestions && newQuestions.map((q,i) => {
          return (
              <form id={`currentQuestionsForm${i}`} className="flex flex-col h-auto w-11/12 justify-center items-center border-2 rounded-md py-2 my-2">
                <span className="flex flex-row w-full justify-center">
                  <h2 className="mr-4 text-lg">{i+1}</h2>
                  <textarea readOnly id={`currentQuestionTextArea${i}`} className="w-11/12 rounded-md p-1" placeholder="Question Text" value={q.questionText}></textarea>
                </span>
                <label className="text-aliceBlue mt-4 mr-2 text-lg" htmlFor="questionTypeSelect">Category</label>
                <select disabled readOnly id="questionTypeSelect" name="questionTypeSelect" className="w-2/5 h-8 text-md mt-1 rounded-md" onChange={(e) => {setQuestionType(e.target.value);}}>
                    <option selected={q.type === "multipleChoice" ? "true": null} value="multipleChoice">Multiple Choice</option>
                    <option selected={q.type === "trueFalse" ? "true": null} value="trueFalse">True or False</option>
                </select>
                <h2 className="text-aliceBlue mt-2 text-lg">Answer</h2>
                {q.type === "trueFalse" &&
                  <div className="flex items-center justify-center border-2 border-spaceCadet rounded-md px-4 py-2">
                    <select disabled id="trueFalseAnswerSelect" className="text-lg">
                      <option selected={q.answers[0].correct} value={q.answers[0].text.toLowerCase()}>{q.answers[0].text}</option>
                      <option selected={q.answers[1].correct} value={q.answers[1].text.toLowerCase()}>{q.answers[1].text}</option>
                    </select>
                  </div>}
                {q.type === "multipleChoice" &&
                  <div className="flex flex-col items-center justify-center border-2 border-spaceCadet rounded-md px-4 py-2 w-4/5">
                    <span className="w-full mb-4">
                      <input readOnly type="text" className="w-4/5 h-10 text-lg" placeholder="Choice 1" value={q.answers[0].text}></input>
                      <input disabled checked={q.answers[0].correct} type="radio" className="ml-4"></input>
                    </span>
                    <span className="w-full mb-4">
                      <input readOnly type="text" className="w-4/5 h-10 text-lg" placeholder="Choice 2" value={q.answers[1].text}></input>
                      <input disabled checked={q.answers[1].correct} type="radio" className="ml-4"></input>
                    </span>
                    {q.answers[2] && <span className="w-full mb-4">
                      <input readOnly type="text" className="w-4/5 h-10 text-lg" placeholder="Choice 3" value={q.answers[2].text}></input>
                      <input disabled checked={q.answers[2].correct} type="radio" className="ml-4"></input>
                    </span>}
                    {q.answers[3] && <span className="w-full">
                      <input readOnly type="text" className="w-4/5 h-10 text-lg" placeholder="Choice 4" value={q.answers[3].text}></input>
                      <input disabled checked={q.answers[3].correct} type="radio" className="ml-4"></input>
                    </span>}
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
      {newQuestions.length >= 3 && 
        <button className="transition-all duration-300 text-xl border-2 border-spaceCadet bg-aliceBlue w-1/5 h-10 mt-2 mb-10 rounded-md self-center hover:bg-gray-300 mr-2"
          onClick={(e) => {
            for(let i = 0; i < questions.length; i++){
              deleteOldQuestion(questions[i]);
            }
            submitGame();
            for(let i = 0; i < newQuestions.length; i++){
              submitQuestions(newQuestions[i]);
            }
            e.preventDefault();
            }}>
          Submit 
        </button>
      }
    </div>
  );
}

export default EditGame;