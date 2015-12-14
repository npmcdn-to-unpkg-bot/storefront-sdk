import product from '../constants/product';
import Search from 'services/Search';
const search = new Search();

export function getProduct(slug) {
  return (dispatch) => {
    // Call API with query parameter
    search.product(slug)
      .then((result) => dispatch(getProductSuccess({slug, product: result.data})))
      .catch((error) => dispatch(getProductFail({slug}, error)));

    dispatch(getProductRequest({slug}));
  };
}

function getProductRequest(slug) {
  return {
    type: product.GET_PRODUCT_REQUEST,
    payload: {
      slug
    }
  };
}

function getProductSuccess(payload) {
  return {
    type: product.GET_PRODUCT_SUCCESS,
    payload
  };
}

function getProductFail(meta, error) {
  return {
    type: product.GET_PRODUCT_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}

export function selectVariation(variation) {
  return {
    type: product.SELECT_VARIATION,
    payload: {
      variation
    }
  };
}
