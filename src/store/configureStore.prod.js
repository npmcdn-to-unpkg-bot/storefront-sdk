import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createReducer } from './functions';

const finalStore = compose(
  applyMiddleware(thunkMiddleware),
)(createStore);

export default function configureStore(initialState) {
  return finalStore(createReducer(), initialState);
}
