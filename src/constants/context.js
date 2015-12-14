import appName from './appName.js';

const namespace = `${appName}/context`;

export default {
  CHANGE_LOCATION: `${namespace}/CHANGE_LOCATION`,
  SET_LOADING: `${namespace}/SET_LOADING`,
  REPLACE_WITH_CACHE: `${namespace}/REPLACE_WITH_CACHE`
};
