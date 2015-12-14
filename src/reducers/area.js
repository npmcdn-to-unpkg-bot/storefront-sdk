import areaConstants from '../constants/area';
import Immutable from 'immutable';
import keys from 'lodash-compat/object/keys';

function getDataFromResources(state, currentURL, resources) {
  return state.withMutations(map =>
    map.setIn([currentURL, 'resources'], keys(resources))
       .setIn([currentURL, 'error'], null)
  );
}

function getInitialState() {
  let currentURL = (window.location.pathname + window.location.search);
  return getDataFromResources(Immutable.Map(), currentURL, window.storefront.currentRoute.resources);
}

export default function resource(state = getInitialState(), action) {
  switch (action.type) {
    case areaConstants.GET_AREA_RESOURCES_REQUEST:
      return state.set(action.payload.currentURL, Immutable.Map());
      break;
    case areaConstants.GET_AREA_RESOURCES_SUCCESS:
      return getDataFromResources(state, action.payload.currentURL, action.payload.resources);
      break;
    case areaConstants.GET_AREA_RESOURCES_FAIL:
      return state.withMutations(map =>
        map.setIn([action.meta.currentURL, 'resources'], null)
           .setIn([action.meta.currentURL, 'error', action.payload])
      );
      break;
    default:
      return state;
  }
}
