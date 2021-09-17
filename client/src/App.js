import './App.css';
import Navbar from "./components/navbar";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App h-screen bg-aliceBlue">
      <Router className="h-full">
        <Navbar/>
        <Switch>
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
