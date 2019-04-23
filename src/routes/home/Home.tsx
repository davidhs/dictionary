import React, { Component } from "react";
import "./Home.scss";
import api from "../../api";
import SearchResults from "../../components/search-results/SearchResults";

class Home extends Component {
  state = {
    searchValue: "",
    resultText: ""
  };

  componentDidMount() {
    const { searchValue } = this.state;

    const result = api.get(searchValue);

    if (typeof result === "string") {
      this.setState({ resultText: result });
    } else {
      if (this.state.resultText.length > 0) {
        this.setState({ resultText: "" });
      }
    }
  }

  onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const resultText = e.target.value;

    this.setState({
      resultText
    });

    this.save(this.state.searchValue, resultText);
  };

  setSearch = (query: string) => {
    this.setState({ searchValue: query });

    const result = api.get(query);

    if (typeof result === "string") {
      this.setState({ resultText: result });
    } else {
      if (this.state.resultText.length > 0) {
        this.setState({ resultText: "" });
      }
    }
  };

  onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    this.setSearch(query);
  };

  save(title: string, description: string) {
    const key = title.trim().toLowerCase();
    const value = description.trim();

    if (key.length > 0) {
      if (value.length > 0) {
        api.set(key, value);
      } else {
        api.remove(key);
      }
    }
  }

  handleSelection = (term: string) => {
    this.setSearch(term);
  };

  onSaveChanges = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.save(this.state.searchValue, this.state.resultText);

    // Force rerender
    this.setState({ state: this.state });
  };

  clear = () => {
    this.setSearch("");
  };

  render() {
    return (
      <div className="App">
        <SearchResults
          query={this.state.searchValue}
          onSelection={this.handleSelection}
        />

        <div className="App__main">
          <div className="App__search">
            <label>
              Search:
              <input
                spellCheck={false}
                className="App__searchInput"
                type="text"
                value={this.state.searchValue}
                onChange={this.onSearchChange}
              />
              <button className="App__searchClear" onClick={this.clear}>{" clear "}</button>
            </label>
          </div>

          <textarea
            className="App__result"
            onChange={this.onTextAreaChange}
            rows={20}
            cols={50}
            value={this.state.resultText}
            placeholder="Description..."
            spellCheck={false}
          />
        </div>
      </div>
    );
  }
}

export default Home;
