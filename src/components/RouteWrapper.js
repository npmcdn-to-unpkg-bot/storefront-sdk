import React from 'react';

class RouteWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  static childContextTypes = {
    parentId: React.PropTypes.string
  };

  getChildContext() {
    return { parentId: this.props.id };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default RouteWrapper;
