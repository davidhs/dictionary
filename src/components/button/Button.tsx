import React from "react";
import "./Button.scss";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: any;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
 
interface State {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  classes: string;
}

class Button extends React.Component<Props, State> {

  state: State = {
    onClick: () => { },
    classes: ''
  }

  componentDidMount() {

    const { onClick = () => { } } = this.props;

    
    const { disabled = false, className = '' } = this.props;

    // væri líka hægt að nota `classnames` pakka
    const classes = [
      'Button', className ? className : null,
      disabled ? 'Button--disabled' : null
    ].filter(Boolean).join(' ');

    this.setState({ onClick, classes });
  }

  render() {

    const { children, disabled = false, style } = this.props;
    const { onClick, classes } = this.state;

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={classes}
        style={style}
        >
        {children}
      </button>
    );
  }
}

export default Button;
