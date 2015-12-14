import areaConstants from '../constants/area';
import Immutable from 'immutable';

function addFacets(state, facets) {
  let path = window.location.pathname + window.location.search;

  let newFacets = state.withMutations(map => {
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

function getInitialState() {
  let resources = window.storefront.currentRoute.resources;
  return getDataFromResources(Immutable.Map(), resources);
}

export default function facets(state = getInitialState(), action) {
  switch (action.type) {
    case areaConstants.GET_AREA_RESOURCES_SUCCESS:
      return getDataFromResources(state, action.payload.resources);
      break;
    default:
      return state;
  }
}
