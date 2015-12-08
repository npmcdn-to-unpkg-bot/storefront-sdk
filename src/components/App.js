import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';

class App extends React.Component {
  triggerRouteChange = () => {
    let route = {
      location: this.props.location,
      params: this.props.params
    };

    dispatcher.actions.ContextActions.changeRoute(route);
  }

  componentDidMount() {
    this.triggerRouteChange();
  }

  componentDidUpdate() {
    this.triggerRouteChange();
  }

  render() {
    return (
      <div className="theme">
        {this.props.children}
      </div>
    );
  }
}

export default App;
