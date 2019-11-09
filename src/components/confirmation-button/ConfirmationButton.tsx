import React from 'react'
import "./ConfirmationButton.scss";
import Button from '../button/Button';

interface Props {
  children: any;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  confirmationMessage?: string;
}

interface State {

}


class ConfirmationButton extends React.Component<Props, State> {

  onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    const { onClick: exteriorOnClick } = this.props;

    const { confirmationMessage = 'Are you sure?' } = this.props;
    const response = window.confirm(confirmationMessage);

    if (response == true) {
      // Pressed OK
      if (exteriorOnClick) {
        exteriorOnClick(e);
      }
    } else {
      // Pressed Cancel
    }
  }

  render() {

    const { children, style } = this.props;

    return (
      <React.Fragment>
        <Button style={style} onClick={this.onClick}>{children}</Button>
      </React.Fragment>
    )
  }
}

export default ConfirmationButton;
