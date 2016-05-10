import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import dispatcher from '../dispatcher/StorefrontDispatcher';

function addFacets(state, facets) {
  const location = dispatcher.stores.ContextStore.getState().get('location');
  const path = location.pathname + location.search;

  const newFacets = state.withMutations(map => {
    map.set(path, Immutable.fromJS(facets));
  });

  return newFacets;
}

function getDataFromResources(state, resources) {
  let facets = {};
  let resource = resources['facets@vtex'] || [];

  resource.forEach((facet) => {
    facets[facet.area] = facet.data;
  });

  return addFacets(state, facets);
}

@immutable
class FacetsStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.FacetsActions);
    this.bindActions(dispatcher.actions.AreaActions);
    let resources = window.storefront.currentRoute.resources;

    this.state = getDataFromResources(Immutable.Map(), resources);
  }

  onGetAreaResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources));
  }

  onGetRouteResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }
}

export default FacetsStore;
