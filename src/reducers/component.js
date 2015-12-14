import componentConstants from '../constants/component';
import Immutable from 'immutable';
import isArray from 'lodash-compat/lang/isArray';

function getComponentProperties(state, _component) {
  let { name, role, area, constructor } = _component;

  let component = Immutable.Map({
    role,
    area,
    constructor
  });

  return {name, component};
}

function registerComponents(state, components) {
  return state.withMutations(map => {
    components.forEach( _component => {
      let {name, component} = getComponentProperties(state, _component);
      return map.set(name, component);
    });
  });
}

export default function component(state = Immutable.Map(), action) {
  switch (action.type) {
    case componentConstants.REGISTER:
      let { payload } = action;
      if (!isArray(payload)) payload = [payload];
      let newState = registerComponents(state, payload);
      return newState;
      break;
    default:
      return state;
  }
}
