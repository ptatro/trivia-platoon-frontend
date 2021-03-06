import './App.css';
import { useCallback, useContext, useEffect } from "react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { UserContext } from "./context/UserContext";
import Register from './components/register';
import Login from './components/login';
import { useCookies } from "react-cookie"
import CreateGame from './components/createGame';
import GamePage from './components/gamePage';
import PlayGame from './components/playGame';
import Profile from './components/userProfile';
import EditGame from './components/editGame';
import JoinGame from './components/joinGame';
import GameLobby from './components/gameLobby';

function App() {
  const [userContext, setUserContext] = useContext(UserContext); // eslint-disable-line
  const [refreshCookie, setRefreshCookie, removeRefreshCookie] = useCookies(['refresh']); // eslint-disable-line

  const verifyUser = useCallback(() => {
    if(!refreshCookie.refresh){return;}
    fetch(`${process.env.REACT_APP_API_ENDPOINT}auth/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "refresh": refreshCookie.refresh
      })
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, access: data.access }
        })
      } else {
        setUserContext(oldValues => {
          return { ...oldValues, access: null }
        })
      }
      // call refreshToken every 14.5 minutes to renew the authentication token.
      setTimeout(verifyUser, 14.5 * 60 * 1000)
    })
  }, [setUserContext, refreshCookie])
  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  useEffect(() => {
    document.title = "Trivia Platoon"
  }, []);

  return (
    <div className="App h-screen bg-aliceBlue flex flex-row">
      <Router className="h-full">
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/game/:gameId" component={GamePage}/>
          {refreshCookie.refresh && <Route exact path="/play/:gameId" component={PlayGame}/>}
          {refreshCookie.refresh && <Route exact path="/edit/:gameId" component={EditGame}/>}
          {refreshCookie.refresh && <Route exact path="/creategame" component={CreateGame}/>}
          {refreshCookie.refresh && <Route exact path="/join" component={JoinGame}/>}
          {refreshCookie.refresh && <Route exact path="/lobby/:slug" component={GameLobby}/>}
          {refreshCookie.refresh && <Route exact path="/profile/:profileUserId" render={(props) => <Profile key={props.match.params.profileUserId}/>}/>}
          {!refreshCookie.refresh && <Route exact path="/register" component={Register}/>}
          {!refreshCookie.refresh && <Route exact path="/login" component={Login}/>}
          <Route><Redirect to="/"/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
