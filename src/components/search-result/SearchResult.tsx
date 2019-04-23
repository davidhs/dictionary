import React, { Component } from "react";
import "./SearchResult.scss";
import api from "../../api";

interface Props {
  term: string;
  onSelection: (term: string) => void;
}

class SearchResult extends Component<Props> {

  handleClick = () => {

    const { term, onSelection  } = this.props;
    onSelection(term);
  }

  render() {
    const { term } = this.props;

    return (
      <li className="SearchResult__item">
      <button onClick={this.handleClick} className="SearchResult__button">{term}</button>
      </li>
    );
  }
}

export default SearchResult;
