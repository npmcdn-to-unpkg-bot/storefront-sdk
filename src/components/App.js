import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';

class App extends React.Component {
  componentWillMount() {
    this.setState({
      location: this.getContextLocation(),
      ...this.updatePage()
    });
  }

  componentDidMount() {
    dispatcher.stores.ContextStore.listen(this.onContextChange);
    dispatcher.stores.AssetStore.listen(this.onAssetChange);
  }

  shouldComponentUpdate(_, nextState) {
    return nextState.loaded && !!nextState.Root;
  }

  componentWillUnmount() {
    dispatcher.stores.ContextStore.unlisten(this.onContextChange);
    dispatcher.stores.AssetStore.unlisten(this.onAssetChange);
  }

  static childContextTypes = {
    history: React.PropTypes.object
  }

  getChildContext() {
    return { history: this.props.history };
  }

  onContextChange = () => this.setState({ location: this.getContextLocation() })

  onAssetChange = () => this.setState({ ...this.updatePage() })

  getContextLocation = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    return ContextStore.get('location');
  }

  getAssetLoading = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    const AssetStore = dispatcher.stores.AssetStore.getState();
    const route = ContextStore.get('route');

    return AssetStore.getIn([route, 'loading']);
  }

  getRootComponent = () => {
    const ContextStore = dispatcher.stores.ContextStore.getState();
    const ComponentStore = dispatcher.stores.ComponentStore.getState();
    const rootName = ContextStore.get('rootComponent');

    return ComponentStore.getIn([rootName, 'constructor']);
  }

  updatePage = () => {
    const isPageLoading = this.getAssetLoading();

    if (isPageLoading === false) {
      const ContextStore = dispatcher.stores.ContextStore.getState();
      return {
        Root: this.getRootComponent(),
        params: ContextStore.get('params'),
        loaded: true
      };
    }

    return { loaded: false };
  }

  render() {
    const { loaded, params, Root } = this.state;
    const location = this.state.location ? this.state.location.toJS() : {};

    if (!loaded) {
      return null;
    }

    return (
      <div className="theme">
        <Root location={location} params={params} />
      </div>
    );
  }
}

export default App;
