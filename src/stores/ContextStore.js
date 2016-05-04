import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';
import { history } from '../StorefrontSDK';

@immutable
class ContextStore {
  constructor(dispatcher) {
    const currentURL = window.location.pathname + window.location.search;

    this.bindActions(dispatcher.actions.ContextActions);
    this.bindActions(dispatcher.actions.RouteActions);

    window._storefront.context.token = ('; ' + document.cookie).split('; VtexIdclientAutCookie=').pop().split(';').shift();

    this.state = Immutable.fromJS({ ...window._storefront.context })
      .withMutations(state => {
        state
          .set('route', window.storefront.currentRoute.name)
          .set('params', window.storefront.currentRoute.params)
          .set('location', history.createLocation(currentURL))
          .set('loading', false)
          .set('_cache', Immutable.Map());
      });
  }

  onGetRouteSuccess({location, resources}) {
    const { route, params } = resources;
    const previousLocation = this.state.get('location');
    let state;

    if (previousLocation) {
      const previousURL = previousLocation.pathname + previousLocation.search;

      state = this.state.withMutations(state => {
        state
          .setIn(['_cache', previousURL, 'route'], this.state.get('route'))
          .setIn(['_cache', previousURL, 'params'], this.state.get('params'))
          .setIn(['_cache', previousURL, 'location'], this.state.get('location'))
          .set('location', location)
          .set('route', route)
          .set('params', params);
      });
    } else {
      state = this.state.withMutations(state => {
        state
          .set('location', location)
          .set('route', route)
          .set('params', params);
      });
    }

    this.setState(state);
  }

  onSetLoading(bool) {
    this.setState(this.state.set('loading', bool));
  }

  replaceWithCache(URL) {
    const previousLocation = this.state.get('location');
    const previousURL = previousLocation.pathname + previousLocation.search;

    const state = this.state.withMutations(state => {
      state
        .setIn(['_cache', previousURL], this.state)
        .set('route', this.state.getIn(['_cache', URL, 'route']))
        .set('params', this.state.getIn(['_cache', URL, 'params']))
        .set('location', this.state.getIn(['_cache', URL, 'location']));
    });

    this.setState(state);
  }
}

export default ContextStore;
