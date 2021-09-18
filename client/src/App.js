import './App.css';
import { useCallback, useContext, useEffect } from "react";
import Navbar from "./components/navbar";
import Home from "./components/home";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { UserContext } from "./context/UserContext";
import Register from './components/register';
import Login from './components/login';
import { useCookies, Cookies } from "react-cookie"
import CreateGame from './components/createGame';

function App() {
  const [userContext, setUserContext] = useContext(UserContext);
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies(['token']);

  return (
    <div className="App h-screen bg-aliceBlue flex flex-row">
      <Router className="h-full">
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Home}/>
          {tokenCookie.token && <Route exact path="/creategame" component={CreateGame}/>}
          {!tokenCookie.token && <Route exact path="/register" component={Register}/>}
          {!tokenCookie.token && <Route exact path="/login" component={Login}/>}
          <Route><Redirect to="/"/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
