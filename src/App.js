import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        Try <a href="/entity/1" style={{color: 'white'}}>a real page</a>
        <br/>
      </header>
    </div>
  );
}

export default App;
