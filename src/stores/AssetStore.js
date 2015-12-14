import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

@immutable
class AssetStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.AreaActions);

    this.state = Immutable.Map();
  }

  onGetAreaAssets({id}) {
    this.setState(this.state.set(id, Immutable.Map({ loading: true })));
  }

  onGetAreaAssetsSuccess({id, assets}) {
    let state = this.state.setIn([id, 'loading'], false).setIn([id, 'payload'], assets);
    this.setState(state);
  }

  onGetAreaAssetsFail({id, error}) {
    let state = this.state.setIn([id, 'loading'], false).setIn([id, 'error'], error);
    this.setState(state);
  }
}

export default AssetStore;
