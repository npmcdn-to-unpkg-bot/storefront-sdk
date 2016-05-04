import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
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

@immutable
class CategoryStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.CategoryActions);
    this.bindActions(dispatcher.actions.RouteActions);
    let resources = window.storefront.currentRoute.resources;

    this.state = getDataFromResources(Immutable.Map(), resources);
  }

  onGetPlaceholderResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }

  onGetRouteResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }
}

export default CategoryStore;
