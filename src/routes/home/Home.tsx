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

function getDateNowString() {
    // date
    const d = new Date();

    let ds = ""; // date string
    ds += leftpad(d.getFullYear(), "0000") + "-";
    ds += leftpad(d.getMonth(), "00") + "-";
    ds += leftpad(d.getDate(), "00") + "-";
    ds += leftpad(d.getHours(), "00");
    ds += leftpad(d.getMinutes(), "00");
    ds += leftpad(d.getSeconds(), "00");

    return ds;
}

interface Props {

}

interface State {
  resultText: string;
  searchValue: string;
  placeholderText: string;
  terms: string[];
}

const defaultPlaceholderText = '';

class Home extends Component<Props, State> {

  state: State = {
    resultText: '',
    searchValue: '',
    placeholderText: defaultPlaceholderText,
    terms: []
  };

  // Custom methods

  setSearchValue = (searchValue: string) => {
    this.setState({ searchValue });

    const resultText = api.get(searchValue);
    const terms = api.searchTermsAndDescriptions(searchValue).slice(0, 20);


    if (typeof resultText === "string") {
      this.setState({ resultText });
    } else {
      if (this.state.resultText.length > 0) {
        this.setState({ resultText: "" });

      }
    }

    if (searchValue.trim().length > 0 && terms.length > 0) {
      const key = terms[0];
      const placeholderText = api.get(key);

      if (placeholderText) {
        this.setState({ placeholderText });
      }
    } else {
      
      const { placeholderText } = this.state;

      if (placeholderText !== defaultPlaceholderText) {
        
        this.setState({ placeholderText: defaultPlaceholderText });
      }
    }

    this.setState({ terms })
  };

  setTermDescription(title: string, description: string) {

    const { searchValue } = this.state;

    const key = title.trim().toLowerCase();
    const value = description;

    
    if (key.length > 0) {
      if (value.length > 0) {
        api.set(key, value);
      } else {
        api.remove(key);
      }
    }

    this.setSearchValue(searchValue);

    // this.forceRerender();
  }

  forceRerender() {
    this.setState({});
  }

  // Lifecycle methods

  componentDidMount() {
    const { searchValue } = this.state;

    this.setSearchValue(searchValue);
  }

  // Handlers

  handleOnChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    const { target: { value: resultText } } = e;
    const { searchValue } = this.state;

    this.setState({
      resultText
    });

    this.setTermDescription(searchValue, resultText);
  };

  handleOnSelection = (term: string) => {
    this.setSearchValue(term);
  };

  handleOnChangeSearchValue = (searchValue: string) => {
    this.setSearchValue(searchValue);
  }

  handleOnImport = (text: string) => {
    api.doImport(JSON.parse(text));
    this.forceRerender();
  }

  handleOnClearEverything = () => {
    api.clear();
    this.forceRerender();
  }

  handleGetContent = () => {
    return JSON.stringify(api.doExport());
  }

  // Render

  render() {

    const { searchValue, resultText, placeholderText, terms } = this.state;

    const ds = getDateNowString();
    const filename = `dictionary-${ds}.json`;

    return (
      <div className="Home">
        <div className="Home__content">
          <div className="Home__top">
            <ImportButton
              onImport={this.handleOnImport}
              style={{ border: 'none' }}
            >
              Import
            </ImportButton>
            <ExportButton
              getContent={this.handleGetContent}
              filename={filename}
              style={{ borderTop: 'none', borderBottom: 'none' }}
            >
              Export
            </ExportButton>
          </div>
          <div className="Home__center">
            <SearchResults
              terms={terms}
              query={searchValue}
              onSelection={this.handleOnSelection}
            />
            <div className="Home__main"
              style={{ borderLeft: 'none' }}
            >
              <InputSearch 
                value={searchValue}
                suggestions={terms}
                onChange={this.handleOnChangeSearchValue}
              />
              <textarea
                className="Home__result"
                onChange={this.handleOnChangeTextArea}
                rows={20}
                cols={50}
                value={resultText}
                placeholder={placeholderText}
                spellCheck={false}
              />
            </div>
          </div>
          <div className="Home__bottom">
            <ConfirmationButton
              onClick={this.handleOnClearEverything}
              confirmationMessage={'Are you sure you want to delete all the terms?'}
              style={{ backgroundColor: 'rgb(255, 180, 180)', color: 'rgb(180, 0, 0)', borderColor: 'rgb(255, 140, 140)' }}
            >
              DELETE EVERYTHING
            </ConfirmationButton>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
