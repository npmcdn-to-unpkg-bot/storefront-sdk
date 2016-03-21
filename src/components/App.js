import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import RouteWrapper from './RouteWrapper';

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
    let childrenWithProps = React.Children.map(this.props.children, (child) => {
      return <RouteWrapper key={child.props.route.id} id={child.props.route.id}>{child}</RouteWrapper>;
    });

    return (
      <div className="theme">
        {childrenWithProps}
      </div>
    );
  }
}

export default App;