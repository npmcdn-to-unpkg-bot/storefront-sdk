import appName from './appName.js';

const namespace = `${appName}/product`;

export default {
  GET_PRODUCT_REQUEST: `${namespace}/GET_PRODUCT_REQUEST`,
  GET_PRODUCT_SUCCESS: `${namespace}/GET_PRODUCT_SUCCESS`,
  GET_PRODUCT_FAIL: `${namespace}/GET_PRODUCT_FAIL`,
  SELECT_VARIATION: `${namespace}/SELECT_VARIATION`,
};
