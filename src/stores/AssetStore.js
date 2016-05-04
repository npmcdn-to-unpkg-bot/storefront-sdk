import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

@immutable
class AssetStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.RouteActions);

    this.state = Immutable.fromJS({
      [window.storefront.currentRoute.name]: {
        payload: window.storefront.currentRoute.assets
      }
    });
  }

  onGetPlaceholder({id}) {
    const state = this.state.set(id, Immutable.Map({ loading: true }));
    this.setState(state);
  }

  onGetPlaceholderSuccess({id, assets}) {
    const state = this.state.withMutations(state => {
      state
        .setIn([id, 'loading'], false)
        .setIn([id, 'payload'], assets);
    });

    this.setState(state);
  }

  onGetPlaceholderFail({id, error}) {
    const state = this.state.withMutations(state => {
      state
        .setIn([id, 'loading'], false)
        .setIn([id, 'error'], error);
    });

    this.setState(state);
  }

  onGetRouteSuccess({resources}) {
    const { route, assets } = resources;
    const state = this.state.setIn([route, 'payload'], assets);

    this.setState(state);
  }

  onGetRouteFail({currentURL, error}) {
    const state = this.state.setIn([currentURL, 'error'], error);
    this.setState(state);
  }
}

export default AssetStore;
