import React, { Component } from 'react';
import './Home.css';

class Home extends Component {

  state = {
    searchValue: '',
    resultText: ''
  }

  find = (query: string) => {

    const result = localStorage.getItem('ns:' + query);

    if (result === null) {
      return '';
    } else {
      return result;
    }
  }

  onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    this.setState({ 
      resultText: e.target.value
    });
  }

  onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const query = e.target.value;

    const result = this.find(query);

    this.setState({ searchValue: query, resultText: result });
  }

  onSaveChanges = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.info('save');

    localStorage.setItem('ns:' + this.state.searchValue, this.state.resultText);
  }

  render() {
    return (
      <div>
        <label>Search: 
          <input type="text" value={this.state.searchValue}
          onChange={this.onSearchChange} />
        </label>

        <br />
        <textarea onChange={this.onTextAreaChange} rows={20} cols={50} value={this.state.resultText}></textarea>
        

        <br />

        <button onClick={this.onSaveChanges}>Save changes</button>
      </div>
    );
  }
}

export default Home;
