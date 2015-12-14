import { search as constants } from '../constants';
import Search from 'services/Search';
const search = new Search();

export function getSearch(params) {
  return (dispatch) => {
    // params should be an immutable object
    if (!params.toJS) {
      return params;
    }

    // Call API with query parameter
    search.products(params.toJS())
      .then((response) => dispatch(getSearchSuccess({ params, products: response.data })))
      .catch((error) => dispatch(getSearchFail({ params, error })));

    dispatch(getSearchRequest(params));
  };
}

function getSearchRequest(payload) {
  return {
    type: constants.GET_SEARCH_REQUEST,
    payload
  };
}

function getSearchSuccess(payload) {
  return {
    type: constants.GET_SEARCH_SUCCESS,
    payload
  };
}

function getSearchFail(meta, error) {
  return {
    type: constants.GET_SEARCH_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}

export function getFacets(params) {
  return (dispatch) => {
    // Call API with query parameter
    search.facets(params)
      .then((result) => {
        dispatch(getFacetsSuccess({ params, results: result.data }));
      })
      .catch((error) => dispatch(getFacetsFail(params, error)));

    dispatch(getFacetsRequest(params));
  };
}

function getFacetsRequest(payload) {
  return {
    type: constants.GET_FACETS_REQUEST,
    payload
  };
}

function getFacetsSuccess(payload) {
  return {
    type: constants.GET_FACETS_SUCCESS,
    payload
  };
}

function getFacetsFail(meta, error) {
  return {
    type: constants.GET_FACETS_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}
