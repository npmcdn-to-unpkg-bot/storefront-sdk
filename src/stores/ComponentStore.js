import Immutable from 'immutable';
import isArray from 'lodash-compat/lang/isArray';
import immutable from 'alt/utils/ImmutableUtil';
import SDK from '../StorefrontSDK.js';
import { register } from '../actionCreators/component';

let _getComponentProperties = function _getComponentProperties(state, _component) {
  let { name, role, area, constructor } = _component;

  let component = Immutable.Map({
    role,
    area,
    constructor
  });

  return {name, component};
};

let _registerComponents = function _registerComponents(state, components) {
  return state.withMutations(map => {
    components.forEach( _component => {
      let {name, component} = _getComponentProperties(state, _component);
      return map.set(name, component);
    });
  });
};

@immutable
class ComponentStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.ComponentActions);

    this.state = Immutable.Map();
  }

  onRegister(param) {
    SDK.store.dispatch(register(param));

    let newState;
    if (isArray(param)) {
      newState = _registerComponents(this.state, param);
    } else {
      newState = _registerComponents(this.state, [param]);
    }

    this.setState(newState);
  }
}

export default ComponentStore;
