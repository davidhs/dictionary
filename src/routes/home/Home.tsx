import React, { Component } from "react";
import "./Home.scss";
import api from "../../api";
import SearchResults from "../../components/search-results/SearchResults";
import InputSearch from '../../components/input-search/InputSearch';
import ImportButton from '../../components/import-button/ImportButton';
import ExportButton from '../../components/export-button/ExportButton';
import ConfirmationButton from '../../components/confirmation-button/ConfirmationButton';



function leftpad(str: string|number, pad: string) {
  return String(pad + str).slice(-pad.length);
}

class Home extends Component {
  state = {
    resultText: '',
    searchValue: '',
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

  setSearchValue = (searchValue: string) => {
    this.setState({ searchValue });

    const result = api.get(searchValue);

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

    this.setSearchValue(query);
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
    this.setSearchValue(term);
  };

  onSaveChanges = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.save(this.state.searchValue, this.state.resultText);

    // Force rerender
    this.setState({ state: this.state });
  };

  clear = () => {
    this.setSearchValue("");
  };

  handleSearchValueChange = (searchValue: string) => {
    this.setSearchValue(searchValue);
  }

  onImport = (text: string) => {
    api.doImport(JSON.parse(text));
    this.setState(this.state);
  }

  createExportData = () => {
    return JSON.stringify(api.doExport());
  }

  handleClearEverything = () => {
    api.clear();
    this.setState(this.state);
  }

  render() {

    const { searchValue, resultText } = this.state;

    // date
    const d = new Date();

    let ds = ""; // date string
    ds += leftpad(d.getFullYear(), "0000") + "-";
    ds += leftpad(d.getMonth(), "00") + "-";
    ds += leftpad(d.getDate(), "00") + "-";
    ds += leftpad(d.getHours(), "00");
    ds += leftpad(d.getMinutes(), "00");
    ds += leftpad(d.getSeconds(), "00");


    const filename = `dictionary-${ds}.json`;

    return (
      <div className="Home">

        <div className="Home__content">

          <div className="Home__top">
            <ImportButton
              onImport={this.onImport}
              style={{ border: 'none' }}>
              Import
            </ImportButton>
            <ExportButton
              getContent={this.createExportData}
              filename={filename}
              style={{ borderTop: 'none', borderBottom: 'none' }}>
              Export
            </ExportButton>
          </div>

          <div className="Home__center">
            <SearchResults
              query={searchValue}
              onSelection={this.handleSelection}
            />

            <div className="Home__main"
              style={{ borderLeft: 'none' }}>

              <InputSearch value={searchValue} onChange={this.handleSearchValueChange} />

              <textarea
                className="Home__result"
                onChange={this.onTextAreaChange}
                rows={20}
                cols={50}
                value={resultText}
                placeholder="Description..."
                spellCheck={false}
              />
            </div>
          </div>

          <div className="Home__bottom">
            <ConfirmationButton
              onClick={this.handleClearEverything}
              confirmationMessage={'Are you sure you want to delete all the terms?'}
              style={{ backgroundColor: 'rgb(255, 180, 180)', color: 'rgb(180, 0, 0)', borderColor: 'rgb(255, 140, 140)' }}>
              DELETE EVERYTHING
            </ConfirmationButton>
          </div>

        </div>
      </div>
    );
  }
}

export default Home;
