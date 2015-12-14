import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistState } from 'redux-devtools';
import DevTools from 'components/DevTools';
import thunkMiddleware from 'redux-thunk';
import { appsReducers, createReducer } from './functions';

const finalStore = compose(
  DevTools.instrument(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  applyMiddleware(thunkMiddleware),
)(createStore);

export default function configureStore() {
  const store = finalStore(createReducer(), {});

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const sdkReducers = require('../reducers');
      store.replaceReducer(combineReducers({
        ...appsReducers,
        SDK: sdkReducers
      }));
    });
  }

  return store;
}
