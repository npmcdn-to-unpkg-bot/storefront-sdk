import appName from './appName.js';

const namespace = `${appName}/search`;

export default {
  GET_SEARCH_REQUEST: `${namespace}/GET_SEARCH_REQUEST`,
  GET_SEARCH_SUCCESS: `${namespace}/GET_SEARCH_SUCCESS`,
  GET_SEARCH_FAIL: `${namespace}/GET_SEARCH_FAIL`,
  GET_FACETS_REQUEST: `${namespace}/GET_FACETS_REQUEST`,
  GET_FACETS_SUCCESS: `${namespace}/GET_FACETS_SUCCESS`,
  GET_FACETS_FAIL: `${namespace}/GET_FACETS_FAIL`
};
