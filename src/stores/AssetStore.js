import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import { loadScript } from 'utils/loadPage';

@immutable
class AssetStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.AreaActions);

    this.state = Immutable.Map();
  }

  onGetAreaAssets({id}) {
    this.setState(this.state.set(id, Immutable.Map({ loading: true })));
  }

  onGetAreaAssetsSuccess({id, assets, addLatest}) {
    let state = this.state.setIn([id, 'loading'], false).setIn([id, 'payload'], assets);

    if (addLatest) {
      let requests = [];
      assets.forEach(asset => requests.push(loadScript(asset)));

      return Promise.all(requests).then(() => this.setState(state));
    }

    this.setState(state);
  }

  onGetAreaAssetsFail({id, error}) {
    let state = this.state.setIn([id, 'loading'], false).setIn([id, 'error'], error);
    this.setState(state);
  }
}

export default AssetStore;
