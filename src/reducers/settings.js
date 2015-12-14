import areaConstants from '../constants/area';
import Immutable from 'immutable';

function getDataFromResources(state, resources) {
  if (resources._settings) {
    let settings = {};

    for (let i = 0; i < resources._settings.length; i++) {
      settings[resources._settings[i].area] = resources._settings[i].data;
    }

    return state.merge(Immutable.fromJS(settings));
  }
  return state;
}

function getInitialState() {
  let resources = window.storefront.currentRoute.resources;
  return getDataFromResources(Immutable.Map(), resources);
}

export default function settings(state = getInitialState(), action) {
  switch (action.type) {
    case areaConstants.SAVE_SETTINGS_SUCCESS:
      const { id, settings } = action.payload;
      return state.setIn([id, 'settings'], Immutable.Map(settings));
      break;
    case areaConstants.GET_AREA_RESOURCES_SUCCESS:
      return getDataFromResources(state, action.payload.resources);
      break;
    default:
      return state;
  }
}
