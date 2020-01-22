import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <div>Sample Pages:</div>
        <a href="/entity/1" className="App-link">entity (recharts)</a><br />
        <a href="/stars/2.5" className="App-link">stars (material-UI)</a>
      </div>
    </div>
  );
}

export default App;
