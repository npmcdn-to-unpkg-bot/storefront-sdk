import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import PurePlaceholder from './Placeholder';
import contextify from 'utils/contextify';

const Placeholder = contextify()(PurePlaceholder);

class Root extends React.Component {
  static childContextTypes = {
    history: React.PropTypes.object
  }

  getChildContext() {
    return {
      history: this.props.history
    };
  }

  componentWillMount() {
    this.setState({
      location: this.getContextLocation(),
      lockRoute: false,
      ...this.updatePage({ lockRoute: false })
    });
  }

  componentDidMount() {
    dispatcher.stores.ContextStore.listen(this.onContextChange);
  }

  shouldComponentUpdate(_, nextState) {
    return nextState.loaded;
  }

  componentWillUnmount() {
    dispatcher.stores.ContextStore.unlisten(this.onContextChange);
  }

  onContextChange = () => {
    this.setState({
      ...this.updatePage(),
      location: this.getContextLocation()
    });
  }

  getContextLocation = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    return ContextStore.get('location');
  }

  updatePage = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    const route = ContextStore.get('route');
    const isPageLoading = ContextStore.get('loading');
    const lockRoute = this.state ? this.state.lockRoute : false;

    if (isPageLoading === false) {
      return {
        route: lockRoute ? (this.state.route || route) : route,
        params: ContextStore.get('params'),
        loaded: true
      };
    }

    return { loaded: false };
  }

  setLockRoute = () => this.setState({ lockRoute: true })

  render() {
    const { loaded, params } = this.state;
    const location = this.state.location || {};
    const id = `${this.state.route}/content`;

    if (!loaded) return null;

    return (
      <div>
        <Placeholder
          id={id}
          params={params}
          location={location}
          setLockRoute={this.setLockRoute}
        />
      </div>
    );
  }
}

export default Root;
