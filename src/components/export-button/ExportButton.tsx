import React from 'react'
import "./ExportButton.scss";
import Button from '../button/Button';

interface Props {
  children: any;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  getContent?: () => string; // content (href)
  filename?: string; // filename (download)
}

interface State {

}


class ExportButton extends React.Component<Props, State> {


  anchor: HTMLAnchorElement | null = null;


  onClick = () => {

    const { getContent, filename } = this.props;

    if (this.anchor && getContent && filename ) {

      const content = getContent();

      // Content here should be a JSON data structure.
      const uriEncodedString = encodeURIComponent(content);

      const data = `text/text;charset=utf-8,${uriEncodedString}`;
      const href = `data:${data}`;
      const download = filename;

      this.anchor.href = href;
      this.anchor.download = download;

      this.anchor.click();
    }
  }

  render() {

    const { children, style } = this.props;

    return (
      <React.Fragment>
        <Button style={style} onClick={this.onClick}>{children}</Button>
        <a ref={anchor => this.anchor = anchor} style={{ display: 'none' }}></a>
      </React.Fragment>
    )
  }
}

export default ExportButton;
