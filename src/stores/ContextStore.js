import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

@immutable
class ContextStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.ContextActions);
    this.bindActions(dispatcher.actions.AreaActions);

    window._storefront.context.token = ('; ' + document.cookie).split('; VtexIdclientAutCookie=').pop().split(';').shift();

    this.state = Immutable.fromJS(window._storefront.context);
  }

  onChangeLocation(location) {
    this.setState(this.state.set('location', Immutable.fromJS(location)));
  }

  onGetRouteResourcesSuccess({resources}) {
    const { route, params } = resources;

    const state = this.state.withMutations(state => {
      state
        .set('route', route)
        .set('params', params);
    });

    this.setState(state);
  }

  onSetLoading(bool) {
    this.setState(this.state.set('loading', bool));
  }
}

export default ContextStore;
