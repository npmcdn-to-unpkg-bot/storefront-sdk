import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

@immutable
class RouteStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.RouteActions);
    this.state = Immutable.fromJS({
      loading: false,
      routes: {}
    });
  }

  onGetRoutes() {
    const state = this.state.withMutations(state => {
      state.set('loading', true);
    });

    this.setState(state);
  }

  onGetRoutesSuccess(data) {
    const state = this.state.withMutations(state => {
      state
        .set('loading', false)
        .set('routes', data);
    });

    this.setState(state);
  }

  onGetRoutesFail(error) {
    const state = this.state.withMutations(state => {
      state.set('loading', false).set('error', error);
    });

    this.setState(state);
  }
}

export default RouteStore;