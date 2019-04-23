import React, { Component } from "react";
import "./SearchResult.scss";
import Button from "../button/Button";

interface Props {
  term: string;
  onSelection: (term: string) => void;
}

class SearchResult extends Component<Props> {

  handleClick = () => {

    const { term, onSelection } = this.props;
    onSelection(term);
  }

  render() {
    const { term } = this.props;

    return (
      <li className="SearchResult__item">
        <Button
          style={{ width: '100%', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
          onClick={this.handleClick}>
          {term}
        </Button>
      </li>
    );
  }
}

export default SearchResult;
