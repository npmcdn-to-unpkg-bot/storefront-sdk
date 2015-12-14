import productConstants from '../constants/product';
import searchConstants from '../constants/search';
import areaConstants from '../constants/area';
import Immutable from 'immutable';
import isArray from 'lodash-compat/lang/isArray';
import flatten from 'lodash-compat/array/flatten';
import values from 'lodash-compat/object/values';
import map from 'lodash-compat/collection/map';

function addProducts(state, products) {
  if (!isArray(products)) {
    products = [products];
  }

  let newProducts = state.withMutations(map => {
    products.forEach((product) => {
      map.set(product.slug, {...product, loading: false});
    });
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

function getInitialState() {
  return getDataFromResources(Immutable.Map(), window.storefront.currentRoute.resources);
}

export default function product(state = getInitialState(), action) {
  switch (action.type) {
    case productConstants.GET_PRODUCT_REQUEST:
      const { slug } = action.payload;
      return state.set(slug, {loading: true});
      break;
    case productConstants.GET_PRODUCT_SUCCESS:
      return addProducts(state, action.payload.product);
      break;
    case productConstants.GET_PRODUCT_FAIL:
      return state.setIn([action.meta.slug, 'error'], error);
      break;
    case searchConstants.GET_SEARCH_SUCCESS:
      return addProducts(state, action.payload.products);
      break;
    case areaConstants.GET_AREA_RESOURCES_SUCCESS:
      return getDataFromResources(state, action.payload.resources);
      break;
    default:
      return state;
  }
}
