import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';

class Img extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountName: dispatcher.stores.ContextStore.getState().get('accountName')
    };
  }

  getBaseUrl(state) {
    return `//${state.accountName}.vteximg.com.br`;
  }

  render() {
    let path;
    let src = this.props.src;
    if (src.indexOf('http') !== -1) {
      path = src;
    } else {
      path = src.replace('#width#', this.props.width).replace('#height#', this.props.width);
      path = this.getBaseUrl(this.state) + path;
    }

    return (
      <img {...this.props} src={path}/>
    );
  }
}

Img.propTypes = {
  src: React.PropTypes.string.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number
};

export default Img;
