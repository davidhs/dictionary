import React from "react";
import "./InputSearch.scss";

import Button from '../button/Button';

interface Props {
  onChange?: (value: string) => void;
  value?: string;
  suggestions?: string[];
}

interface State {
}

class InputSearch extends React.Component<Props, State> {

  handleOnChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: searchValue } } = e;
    this.setSearchValue(searchValue);
  }

  handleOnClickClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setSearchValue('');
  }

  handleOnKeyDownSearchValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      const { suggestions } = this.props;
      
      if (suggestions) {
        if (suggestions.length > 0) {
          const topSuggestion = suggestions[0];
          const { value } = this.props;

          if (value !== topSuggestion) {
            e.preventDefault();
            this.setSearchValue(topSuggestion);
          }
        }
      }
    }
  }

  setSearchValue = (searchValue: string) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(searchValue);
    }
  }


  render() {

    const { value } = this.props;

    return (
      <div className="InputSearch">
        <label className="InputSearch__search">
          <span className="InputSearch__label">Search:</span>
          <input
            spellCheck={false}
            className="InputSearch__input"
            type="text"
            value={value}
            onKeyDown={this.handleOnKeyDownSearchValue}
            onChange={this.handleOnChangeSearchValue}
          />

        </label>
        <Button
          onClick={this.handleOnClickClear}
          style={{ border: 'none' }}
        >clear</Button>
      </div>
    );
  }
}

export default InputSearch;
