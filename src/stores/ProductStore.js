import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import isArray from 'lodash-compat/lang/isArray';
import flatten from 'lodash-compat/array/flatten';
import values from 'lodash-compat/object/values';
import map from 'lodash-compat/collection/map';

function addProducts(state, products) {
  if (!isArray(products)) {
    products = [products];
  }

  let newProducts = state.withMutations(map => {
    products.forEach( product => map.set(product.slug, product) );
  });

  return newProducts;
}

function getDataFromResources(state, resources) {
  let products = [];
  if (resources['product@vtex']) {
    products = flatten(values(map(resources['product@vtex'], (area) => area.data)));
  }

  if (resources['products@vtex']) {
    products = flatten(products.concat(
      flatten(values(map(resources['products@vtex'], (area) => area.data)))
    ));
  }

  return addProducts(state, products);
}


@immutable
class ProductStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.SearchActions);
    this.bindActions(dispatcher.actions.ProductActions);
    this.bindActions(dispatcher.actions.AreaActions);

    this.state = getDataFromResources(Immutable.Map(), window.storefront.currentRoute.resources);

    this.exportPublicMethods({
      getProducts: this.getProducts
    });
  }

  getProducts(products) {
    if (!products) {
      return null;
    }

    let result = [];
    for (var i = 0; i < products.length; i++) {
      let product = this.state.get(products[i]);
      if (product) {
        result.push(product);
      }
    }

    return result;
  }

  onRequestProductSuccess(product) {
    this.setState(addProducts(this.state, product));
  }

  onRequestProductFail(error) {
    this.setState(this.state.set('error', error));
  }

  onRequestSearchSuccess({ products }) {
    this.setState(addProducts(this.state, products));
  }

  onGetAreaResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources));
  }

  onGetRouteResourcesSuccess({ resources }) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }
}

export default ProductStore;
