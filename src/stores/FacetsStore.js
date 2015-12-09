import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

function addFacets(state, facets) {
  let path = window.location.pathname + window.location.search;

  let newFacets = state.withMutations(map => {
    map.set(path, Immutable.fromJS(facets));
  });

  return newFacets;
}

function getDataFromResources(state, resources) {
  let facets = {};

  for (let facet of resources['facets@vtex']) {
    facets[facet.area] = facet.data;
  }

  return addFacets(state, facets);
}

@immutable
class FacetsStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.FacetsActions);
    this.bindActions(dispatcher.actions.ResourceActions);
    let resources = window.storefront.currentRoute.resources;

    this.state = getDataFromResources(Immutable.Map(), resources);
  }

  onGetAreaResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources));
  }
}

export default FacetsStore;
