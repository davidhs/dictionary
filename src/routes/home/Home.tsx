import React, { Component } from "react";
import "./Home.scss";
import api from "../../api";
import SearchResults from "../../components/search-results/SearchResults";
import InputSearch from "../../components/input-search/InputSearch";
import ImportButton from "../../components/import-button/ImportButton";
import ExportButton from "../../components/export-button/ExportButton";
import ConfirmationButton from "../../components/confirmation-button/ConfirmationButton";

import InputText from "../../components/input-text/InputText";

function leftpad(str: string | number, pad: string) {
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

interface Props {}

interface State {
  resultText: string;
  searchValue: string;
  placeholderText: string;
  terms: { namespace: string; key: string }[];
  namespace: string;
  flattenedTerms: string[];
  namespaces: string[];
}

const defaultPlaceholderText = "";
const defaultNamespace = "default";

class Home extends Component<Props, State> {
  state: State = {
    resultText: "",
    searchValue: "",
    placeholderText: defaultPlaceholderText,
    terms: [],
    namespace: defaultNamespace,
    flattenedTerms: [],
    namespaces: []
  };

  updateTerms(
    searchValue: string = this.state.searchValue,
    namespace: string = this.state.namespace
  ) {
    const result = api.searchTermsAndDescriptions(searchValue, namespace);

    const { terms, namespaceExists, namespaces } = result;

    const didNotExistBefore = !namespaces.includes(this.state.namespace);


    if (
      this.state.namespace !== "*" &&
      didNotExistBefore &&
      namespaces.includes(namespace)
    ) {
      this.setState({ searchValue: "" });
    }

    let flattenedTerms: string[];

    if (namespaceExists) {
      flattenedTerms = terms.map(term => {
        return term.key;
      });
    } else {
      flattenedTerms = terms.map(term => {
        return `${term.namespace}: ${term.key}`;
      });
    }

    this.setState({ terms, flattenedTerms, namespaces });

    return {
      terms,
      flattenedTerms,
      namespaces
    };
  }

  // Custom methods

  resolveSearch(namespace: string, searchValue: string) {

    const { terms } = this.updateTerms(searchValue, namespace);

    const resultText = api.get(searchValue, namespace);

    if (typeof resultText === "string") {
      this.setState({ resultText });
    } else {
      if (this.state.resultText.length > 0) {
        this.setState({ resultText: "" });
      }
    }

    if (searchValue.trim().length > 0 && terms.length > 0) {
      const key = terms[0].key;
      const placeholderText = api.get(key, namespace);

      if (placeholderText) {
        this.setState({ placeholderText });
      }
    } else {
      const { placeholderText } = this.state;

      if (placeholderText !== defaultPlaceholderText) {
        this.setState({ placeholderText: defaultPlaceholderText });
      }
    }

    this.setState({ terms });
  }

  setSearchValue = (searchValue: string) => {
    const { namespace, namespaces } = this.state;
    this.setState({ searchValue });

    if (namespaces.includes(namespace)) {
      this.resolveSearch(namespace, searchValue);
    } else if (namespace === "*") {
      const index = searchValue.indexOf(":");
      const originalSearchValue = searchValue;

      if (index >= 0) {
        // Has split

        const namespace = originalSearchValue.substring(0, index).trim();
        const searchValue = originalSearchValue
          .substring(index + 1, originalSearchValue.length)
          .trim();

        this.resolveSearch(namespace, searchValue);
      } else {
        // Search everything
        this.resolveSearch("*", searchValue);
      }
    } else {
      // use to pick namespace
      // TODO: this is broken
      // this.setNamespace(searchValue.trim());
    }
  };

  setTermDescription(title: string, description: string) {
    const { namespace, namespaces } = this.state;

    if (namespaces.includes(namespace)) {
      const key = title.trim().toLowerCase();
      const value = description;

      if (key.length > 0) {
        if (value.length > 0) {
          api.set(key, value, namespace);
        } else {
          api.remove(key, namespace);
        }
      }
      this.updateTerms();
    } else if (namespace === "*") {
      const index = title.indexOf(":");

      const originalTitle = title;

      if (index >= 0) {
        const namespace = originalTitle.substring(0, index).trim();
        const title = originalTitle
          .substring(index + 1, originalTitle.length)
          .trimLeft();

        const key = title.trim().toLowerCase();
        const value = description;

        if (key.length > 0) {
          if (value.length > 0) {
            api.set(key, value, namespace);
          } else {
            api.remove(key, namespace);
          }
        }
        this.updateTerms(title, namespace);
      }
    } else {
      const key = title.trim().toLowerCase();
      const value = description;

      if (key.length > 0) {
        if (value.length > 0) {
          api.set(key, value, namespace);
        } else {
          api.remove(key, namespace);
        }
      }
      this.updateTerms();
    }
  }

  setNamespace(namespace: string) {
    const { searchValue } = this.state;

    this.setState({ placeholderText: "" });

    this.updateTerms(searchValue, namespace);

    this.setState({ namespace });
  }

  forceRerender() {
    this.setState({});
  }

  // Lifecycle methods

  componentDidMount() {
    const { searchValue, namespace } = this.state;
    this.setSearchValue(searchValue);
    this.setNamespace(namespace);
  }

  // Handlers

  handleOnChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value: resultText }
    } = e;
    const { searchValue, namespaces } = this.state;

    const namespace = this.state.namespace.trim();

    if (searchValue.trim().length > 0) {
      if (namespaces.includes(namespace)) {
        this.setState({
          resultText
        });

        this.setTermDescription(searchValue, resultText);
      } else if (namespace === "*") {
        const index = searchValue.indexOf(":");

        if (index >= 0) {
          const right = searchValue
            .substring(index + 1, searchValue.length)
            .trim();

          if (right.length > 0) {
            this.setState({
              resultText
            });
            this.setTermDescription(searchValue, resultText);
          }
        }
      } else {
        // CREATE NEW DUMBASS
        this.setTermDescription(searchValue, resultText);
      }
    }
  };

  handleOnSelection = (searchValue: string) => {

    const { namespace, namespaces } = this.state;

    if (namespaces.includes(namespace) || namespace.trim() === '*') {
      this.setSearchValue(searchValue);
    } else {
      this.setNamespace(searchValue);
    }


  };

  handleOnChangeSearchValue = (searchValue: string) => {
    this.setSearchValue(searchValue);
  };

  handleOnImport = (text: string) => {
    api.doImport(JSON.parse(text));
    this.updateTerms();
  };

  handleOnClearEverything = () => {
    api.clear();
    this.updateTerms();
  };

  handleGetContent = () => {
    return JSON.stringify(api.doExport());
  };

  handleOnChangeNamespace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const namespace = e.target.value.trim();

    this.setNamespace(namespace);

    if (namespace.length === 0) {

      const { placeholderText } = this.state;

      this.setSearchValue('');
      this.setState({ placeholderText: '' })
    }
  };

  autocomplete = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    suggestions: string[]
  ) => {

    const { namespace } = this.state;

    let lookupValue;
    let derivedNamespace;
    let derived = false;

    let space1 = '';
    let space2 = '';
    let space3 = '';
    let space4 = '';

    if (namespace === "*") {
      const index = value.indexOf(":");

      if (index >= 0) {
        derived = true;

        const leftPart = value.substring(0, index);
        const rightPart = value.substring(index + 1, value.length);

        derivedNamespace = leftPart.trim();
        lookupValue = rightPart.trim();

        const idx1 = leftPart.indexOf(derivedNamespace);
        const idx2 = derivedNamespace.length + idx1;

        const idx3 = rightPart.indexOf(lookupValue);
        const idx4 = lookupValue.length + idx3;


        space1 = ' '.repeat(idx1);
        space2 = ' '.repeat(leftPart.length - idx2);
        space3 = ' '.repeat(idx3);
        space4 = ' '.repeat(rightPart.length - idx4);

      } else {
        lookupValue = value;
      }
    } else {
      lookupValue = value;
    }

    if (e.key === "Enter" || e.key === "Tab") {
      if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];

        if (derived) {
          if (
            lookupValue !== topSuggestion &&
            topSuggestion.startsWith(lookupValue)
          ) {

            e.preventDefault();
            return `${space1}${derivedNamespace}${space2}:${space3}${topSuggestion}${space4}`;
          }
        } else if (namespace === "*") {
          // Degenerate case

          e.preventDefault();
          return topSuggestion;
        } else {
          if (
            lookupValue !== topSuggestion &&
            topSuggestion.startsWith(lookupValue)
          ) {
            e.preventDefault();
            return topSuggestion;
          }
        }

        if (
          lookupValue !== topSuggestion &&
          topSuggestion.startsWith(lookupValue)
        ) {
          e.preventDefault();

          if (derived) {
            return `${space1}${derivedNamespace}${space2}:${space3}${topSuggestion}${space4}`;
          } else {
            return topSuggestion;
          }
        }


      }
    }

    return value;
  };

  // Render

  render() {
    const {
      searchValue,
      resultText,
      placeholderText,
      terms,
      flattenedTerms,
      namespace,
      namespaces
    } = this.state;

    const ds = getDateNowString();
    const filename = `dictionary-${ds}.json`;

    let listedTerms;

    if (namespaces.includes(namespace)) {
      listedTerms = flattenedTerms;
    } else {
      if (namespace === "*") {
        listedTerms = flattenedTerms;
      } else {
        listedTerms = namespaces.filter(ns =>
          ns.startsWith(namespace)
        );
      }
    }

    return (
      <div className="Home">
        <div className="Home__content">
          <div className="Home__top">
            <div className="Home__topLeft">
              <ImportButton
                onImport={this.handleOnImport}
                style={{ border: "none" }}
              >
                Import
              </ImportButton>
              <ExportButton
                getContent={this.handleGetContent}
                filename={filename}
                style={{ borderTop: "none", borderBottom: "none" }}
              >
                Export
              </ExportButton>
            </div>
            <div className="Home__topRight">
              <InputText
                value={namespace}
                onChange={this.handleOnChangeNamespace}
              />
            </div>
          </div>
          <div className="Home__center">
            <SearchResults
              terms={listedTerms}
              query={searchValue}
              onSelection={this.handleOnSelection}
            />
            <div className="Home__main" style={{ borderLeft: "none" }}>
              <InputSearch
                value={searchValue}
                suggestions={listedTerms}
                autocomplete={this.autocomplete}
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
              confirmationMessage={
                "Are you sure you want to delete all the terms?"
              }
              style={{
                backgroundColor: "rgb(255, 180, 180)",
                color: "rgb(180, 0, 0)",
                borderColor: "rgb(255, 140, 140)"
              }}
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
