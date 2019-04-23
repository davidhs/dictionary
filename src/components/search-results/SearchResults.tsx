import React, { Component } from "react";
import "./SearchResults.scss";
import api from "../../api";
import SearchResult from '../search-result/SearchResult';

interface Props {
  query: string;
  onSelection: (term: string) => void;
}

class SearchResults extends Component<Props> {

  render() {
    const { query, onSelection } = this.props;

    const results = api.searchTermsAndDescriptions(query).slice(0, 20);

    return (
      <div className="SearchResults">
        <ul>{results && results.map((result, idx) => (
          <SearchResult key={idx} term={result} onSelection={onSelection} />
        ))}</ul>
      </div>
    );
  }
}

export default SearchResults;
