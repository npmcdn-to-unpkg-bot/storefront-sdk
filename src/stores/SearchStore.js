import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import pluck from 'lodash-compat/collection/pluck';

function getDataFromResources(state, resources) {
  let path = window.location.pathname + window.location.search;
  let productsAreas = resources['products@vtex'];
  let productAreas = resources['product@vtex'];

  return state.withMutations(map => {
    if (productsAreas) {
      for (let currentArea of productsAreas) {
        let productsSlug = pluck(currentArea.data, 'slug');
        map.setIn([path, currentArea.area, 'results'], productsSlug);
      }
    }
    if (productAreas) {
      for (let currentArea of productAreas) {
        let productSlug = pluck(currentArea.data, 'slug');
        map.setIn([path, currentArea.area, 'results'], productSlug);
      }
    }
  });
}

@immutable
class SearchStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.SearchActions);
    this.bindActions(dispatcher.actions.RouteActions);

    this.state = getDataFromResources(Immutable.Map(), window.storefront.currentRoute.resources);
  }

  onRequestSearch(params) {
    if (!params.toJS) {
      return;
    }

    this.setState(this.state.set(params, Immutable.Map({'loading': true})));
  }

  onRequestSearchSuccess({ params, products }) {
    let state = this.state.setIn([params, 'results'], products.map( product => product.slug ));
    state = state.setIn([params, 'loading'], false);
    this.setState(state);
  }

  onRequestSearchFail({ params, error }) {
    let state = this.state.setIn([params, 'error'], error);
    state = state.setIn([params, 'loading'], false);
    this.setState(state);
  }

  onRequestFacets(params) {
    this.setState(this.state.setIn([params, 'facets'], params.facets));
  }

  onRequestFacetsSuccess({ params, facets }) {
    this.setState(this.state.setIn([params, 'facets'], facets));
  }

  onRequestFacetsFail({ params, error }) {
    this.setState(this.state.setIn([params, 'error'], error));
  }

  onGetPlaceholderResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }

  onGetRouteResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }
}

export default SearchStore;
