import React from "react";
import Button from '../button/Button';

import "./InputSearch.scss";


interface Props {
  onChange?: (value: string) => void;
  value?: string;
  suggestions?: string[];
  autocomplete?: (event: React.KeyboardEvent<HTMLInputElement>, value: string, suggestions: string[]) => string;
}


const defaultAutocomplete = (e: React.KeyboardEvent<HTMLInputElement>, value: string, suggestions: string[]) => {
  if (e.key === 'Enter' || e.key === 'Tab') {

    if (suggestions) {
      if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];

        if (e.key === 'Tab') {
          if (value) {
            if (value !== topSuggestion && topSuggestion.startsWith(value)) {
              e.preventDefault();
              return topSuggestion;
            }
          }
        } else {
          if (value !== topSuggestion) {
            return topSuggestion;
          }
        }
      }
    }
  }

  return value;
}

interface State {}

class InputSearch extends React.Component<Props, State> {

  handleOnChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: searchValue } } = e;
    this.setSearchValue(searchValue);
  }

  handleOnClickClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setSearchValue('');
  }

  handleOnKeyDownSearchValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { autocomplete, value, suggestions } = this.props;

    if (autocomplete) {
      if (value && suggestions) {
        const autocompleteValue = autocomplete(e, value, suggestions)
        this.setSearchValue(autocompleteValue);
      }
    } else {
      if (value && suggestions) {
        const autocompleteValue = defaultAutocomplete(e, value, suggestions)
        this.setSearchValue(autocompleteValue);
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
