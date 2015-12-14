import contextConstants from '../constants/context';
import Immutable from 'immutable';

const initialState = Immutable.fromJS(window._storefront.context);

export default function context(state = initialState, action) {
  switch (action.type) {
    case contextConstants.CHANGE_LOCATION:
      return state.set('route', Immutable.fromJS(action.payload.location));
      break;
    default:
      return state;
  }
}
