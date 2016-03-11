import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

@immutable
class AssetStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.AreaActions);

    this.state = Immutable.Map();
  }

  onGetAreaAssets({id}) {
    const state = this.state.set(id, Immutable.Map({ loading: true }));
    this.setState(state);
  }

  onGetAreaAssetsSuccess({id, assets}) {
    const state = this.state.withMutations(state => {
      state
        .setIn([id, 'loading'], false)
        .setIn([id, 'payload'], assets);
    });

    this.setState(state);
  }

  onGetAreaAssetsFail({id, error}) {
    const state = this.state.withMutations(state => {
      state
        .setIn([id, 'loading'], false)
        .setIn([id, 'error'], error);
    });

    this.setState(state);
  }

  onGetRouteResourcesSuccess({resources}) {
    const { route, assets } = resources;
    const state = this.state.withMutations(state => {
      state
        .setIn([route, 'loading'], true)
        .setIn([route, 'payload'], assets);
    });

    this.setState(state);
  }

  onGetRouteResourcesFail({currentURL, error}) {
    const state = this.state.setIn([currentURL, 'error'], error);
    this.setState(state);
  }

  onLoadPageSuccess(route) {
    const state = this.state.setIn([route, 'loading'], false);
    this.setState(state);
  }
}

export default AssetStore;
