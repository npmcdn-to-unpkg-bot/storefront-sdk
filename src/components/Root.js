import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import Placeholder from './Placeholder';

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
      ...this.updatePage()
    });
  }

  componentDidMount() {
    dispatcher.stores.ContextStore.listen(this.onContextChange);
    dispatcher.stores.AssetStore.listen(this.onAssetChange);
  }

  shouldComponentUpdate(_, nextState) {
    return nextState.loaded;
  }

  componentWillUnmount() {
    dispatcher.stores.ContextStore.unlisten(this.onContextChange);
    dispatcher.stores.AssetStore.unlisten(this.onAssetChange);
  }

  onContextChange = () => this.setState({ location: this.getContextLocation() })

  onAssetChange = () => this.setState({ ...this.updatePage() })

  getContextLocation = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    return ContextStore.get('location');
  }

  updatePage = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    const AssetStore = dispatcher.stores.AssetStore.getState();
    const route = ContextStore.get('route');
    const isPageLoading = AssetStore.getIn([route, 'loading']);

    if (isPageLoading === false) {
      return {
        route: this.state.lockRoute ? (this.state.route || route) : route,
        params: ContextStore.get('params'),
        loaded: true
      };
    }

    return { loaded: false };
  }

  setLockRoute = () => this.setState({ lockRoute: true })

  render() {
    const { loaded, params } = this.state;
    const location = this.state.location ? this.state.location.toJS() : {};
    const id = `${this.state.route}/content`;

    if (!loaded) return null;

    return (
      <div className="theme">
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
