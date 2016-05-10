import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import pluck from 'lodash-compat/collection/pluck';
import dispatcher from '../dispatcher/StorefrontDispatcher';

function getDataFromResources(state, resources) {
  const location = dispatcher.stores.ContextStore.getState().get('location');
  const path = location.pathname + location.search;
  const productsAreas = resources['products@vtex'];
  const productAreas = resources['product@vtex'];

  return state.withMutations(map => {
    if (productsAreas) {
      for (let currentArea of productsAreas) {
        const productsSlug = pluck(currentArea.data, 'slug');
        map.setIn([path, currentArea.area, 'results'], productsSlug);
      }
    }
    if (productAreas) {
      for (let currentArea of productAreas) {
        const productSlug = pluck(currentArea.data, 'slug');
        map.setIn([path, currentArea.area, 'results'], productSlug);
      }
    }
  });
}

@immutable
class SearchStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.SearchActions);
    this.bindActions(dispatcher.actions.AreaActions);

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

  onGetAreaResourcesSuccess({resources}) {
    this.setState(getDataFromResources(this.state, resources));
  }

  onGetRouteResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }
}

export default SearchStore;
