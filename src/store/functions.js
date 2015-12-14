import { combineReducers } from 'redux';
import reducers from '../reducers';

export let appsReducers = {};

export function registerAppReducers(store, newAppsReducers) {
  appsReducers = { ...appsReducers, ...newAppsReducers };

  store.replaceReducer(createReducer());
}

export function createReducer() {
  return combineReducers({
    ...appsReducers,
    SDK: reducers
  });
}
