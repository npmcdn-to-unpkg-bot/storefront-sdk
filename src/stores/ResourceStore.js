import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import keys from 'lodash-compat/object/keys';

function getDataFromResources(state, currentURL, resources) {
  return state.withMutations(map =>
    map.setIn([currentURL, 'resources'], keys(resources))
       .setIn([currentURL, 'error'], null)
  );
}

@immutable
class ResourceStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.AreaActions);

    let currentURL = (window.location.pathname + window.location.search);
    this.state = getDataFromResources(Immutable.Map(), currentURL, window.storefront.currentRoute.resources);
  }

  onGetAreaResources({currentURL}) {
    this.setState(this.state.set(currentURL, Immutable.Map()));
  }

  onGetAreaResourcesSuccess({currentURL, resources}) {
    this.setState(getDataFromResources(this.state, currentURL, resources));
  }

  onGetAreaResourcesError({currentURL, error}) {
    let newState = this.state.withMutations(map =>
      map.setIn([currentURL, 'resources'], null)
         .setIn([currentURL, 'error', error])
    );
    this.setState(newState);
  }
}

export default ResourceStore;
