import searchConstants from '../constants/search';
import areaConstants from '../constants/area';
import Immutable from 'immutable';
import pluck from 'lodash-compat/collection/pluck';

function getDataFromResources(state, resources) {
  let path = window.location.pathname + window.location.search;
  let productsAreas = resources['products@vtex'];
  let productAreas = resources['product@vtex'];

  return state.withMutations(map => {
    if (productsAreas) {
      for (let currentArea of productsAreas) {
        let productsSlug = pluck(currentArea.data, 'slug');
        let results = Immutable.Map().setIn([currentArea.area, 'results'], productsSlug);
        map.set(path, results);
      }
    }
    if (productAreas) {
      for (let currentArea of productAreas) {
        let productSlug = pluck(currentArea.data, 'slug');
        let results = Immutable.Map().setIn([currentArea.area, 'results'], productSlug);
        map.set(path, results);
      }
    }
  });
}

function getInitialState() {
  return getDataFromResources(Immutable.Map(), window.storefront.currentRoute.resources);
}

export default function search(state = getInitialState(), action) {
  let newState;

  switch (action.type) {
    case searchConstants.GET_SEARCH_REQUEST:
      if (!action.payload.toJS) return state;
      return state.set(action.payload, Immutable.Map({'loading': true}));
      break;
    case searchConstants.GET_SEARCH_SUCCESS:
      newState = state.setIn([action.payload.params, 'results'], action.payload.products.map( product => product.slug ));
      return newState.setIn([action.payload.params, 'loading'], false);
      break;
    case searchConstants.GET_SEARCH_FAIL:
      newState = state.setIn([action.meta, 'error'], action.payload);
      return newState.setIn([action.meta, 'loading'], false);
      break;
    case searchConstants.GET_FACETS_REQUEST:
      return state.setIn([action.payload.params, 'facets'], action.payload.facets);
      break;
    case searchConstants.GET_FACETS_SUCCESS:
      return state.setIn([action.payload.params, 'facets'], action.payload.facets);
      break;
    case searchConstants.GET_FACETS_FAIL:
      return state.setIn([action.meta, 'error'], action.payload);
      break;
    case areaConstants.GET_AREA_RESOURCES_SUCCESS:
      return getDataFromResources(state, action.payload.resources);
    default:
      return state;
  }
}
