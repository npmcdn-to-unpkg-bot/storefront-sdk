import React from 'react';
import Area from './Area';

class Root extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    parentId: React.PropTypes.string
  };

  render() {
    return (
      <div className="theme">
        <Area
          id="content"
          params={this.props.params}
          location={this.props.location}
        />
      </div>
    );
  }
}

export default Root;
