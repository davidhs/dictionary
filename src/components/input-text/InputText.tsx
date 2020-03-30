import React from "react";
import "./InputText.scss";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface State {}

class InputText extends React.Component<Props, State> {

  render() {
    const { value, onChange } = this.props;

    return (
      <input
        type="text"
        className="InputText__input"
        value={value}
        placeholder={'namespace'}
        onChange={onChange}
      />
    );
  }
}

export default InputText;
