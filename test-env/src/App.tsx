import * as React from 'react';
import './App.css';

import AutoComplete from './AutoComplete/index';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">尝试键入一个英文字母 ？</h1>
        </header>
        <AutoComplete dataSource={['Apple','Balana']}/>
      </div>
    );
  }
}

export default App;
