import React from 'react'

import "./ImportButton.scss";
import Button from '../button/Button';

interface Props {
  children: any;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  onImport: (text: string) => void;
}

interface State {
  
}

class ImportButton extends React.Component<Props, State> {

  inputElement: HTMLInputElement | null = null;

  onClick = () => {
    if (this.inputElement) {
      this.inputElement.click();
    }
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { onImport } = this.props;

    const reader = new FileReader();
    reader.onload = function (e2) {

      if (e2 && e2.target) {

        const { target } = e2 as any;
        
        const text = target.result as string;
        onImport(text);
      }
    };

    if (e && e.target) {
      const { files } = e.target;
      if (files) {
        reader.readAsText(files[0]);
      }
    }
    
  }

  render() {

    const { children, style } = this.props;

    return (
      <React.Fragment>
        <Button style={style} onClick={this.onClick}>{ children }</Button>
        <input onChange={this.handleFileChange} ref={input => this.inputElement = input} className="ImportButton__input" type="file" />
      </React.Fragment>
    )
  }
}

export default ImportButton;
