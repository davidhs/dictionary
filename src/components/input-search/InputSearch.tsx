import React from "react";
import "./InputSearch.scss";

import Button from '../button/Button';

interface Props {
  onChange?: (value: string) => void;
  value?: string;
}

interface State {
}

class InputSearch extends React.Component<Props, State> {

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: searchValue } } = e;
    this.setSearchValue(searchValue);
  }

  handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setSearchValue('');
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
            onChange={this.handleSearchChange}
          />

        </label>
        <Button
          onClick={this.handleClear}
          style={{ border: 'none' }}
        >clear</Button>
      </div>
    );
  }
}

export default InputSearch;
