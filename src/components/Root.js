import React from 'react';
import Placeholder from './Placeholder';

class Root extends React.Component {
  render() {
    return (
      <div className="theme">
        <Placeholder
          id="content"
          params={this.props.params}
          location={this.props.location}
        />
      </div>
    );
  }
}

export default Root;
