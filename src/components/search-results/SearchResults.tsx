import React, { Component } from "react";
import "./SearchResults.scss";
import api from "../../api";
import SearchResult from "../search-result/SearchResult";

interface Props {
  query?: string;
  onSelection: (term: string) => void;
  terms?: string[];
}

interface State {}

class SearchResults extends Component<Props, State> {
  render() {
    const { onSelection, query, terms } = this.props;

    return (
      <div className="SearchResults">
        <div className="SearchResults__container">
          <ul className="SearchResults__list">
            {terms &&
              terms.map((term, idx) => (
                <SearchResult key={idx} term={term} onSelection={onSelection} />
              ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchResults;
