import areaConstants from '../constants/area';
import Immutable from 'immutable';
import isArray from 'lodash-compat/lang/isArray';
import flatten from 'lodash-compat/array/flatten';
import map from 'lodash-compat/collection/map';

function addCategories(state, categories) {
  if (!isArray(categories)) {
    categories = [categories];
  }

  let newCategories = state.withMutations(map => {
    categories.forEach((category) => {
      map.set(category.slug, Immutable.fromJS(category));
    });
  });

  return newCategories;
}

function getDataFromResources(state, resources) {
  let categories = flatten(map(resources['categories@vtex'], (area) => area.data));

  return addCategories(state, categories);
}

function getInitialState() {
  let resources = window.storefront.currentRoute.resources;
  return getDataFromResources(Immutable.Map(), resources);
}

export default function category(state = getInitialState(), action) {
  switch (action.type) {
    case areaConstants.GET_AREA_RESOURCES_SUCCESS:
      return getDataFromResources(state, action.payload.resources);
      break;
    default:
      return state;
  }
}
