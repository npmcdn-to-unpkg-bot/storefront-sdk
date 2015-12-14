import { polyfill as PromisePolyfill } from 'es6-promise';
PromisePolyfill();

import 'expose?React!react';
import 'expose?ReactDOM!react-dom';
import 'expose?ReactCSSTransitionGroup!react-addons-css-transition-group';
import 'expose?ReactShallowCompare!react-addons-shallow-compare';
import 'expose?ReactIntl!react-intl';
import 'expose?ReactHelmet!react-helmet';
import 'expose?Redux!redux';
import 'expose?ReactRedux!react-redux';

import { createHistory, useQueries } from 'history';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';

import dispatcher from './dispatcher/StorefrontDispatcher';
import connectToStores from './utils/connectToStores';
import Root from './components/Root';
import { loadScript, loadPage } from './utils/loadPage';

import { Provider } from 'react-redux';
import configureStore, { registerAppReducers } from './store/configureStore';
import * as actions from './constants';
import * as actionCreators from './actionCreators';
import DevTools from 'components/DevTools';

import * as storefrontService from 'services/Storefront';
import checkoutService from 'services/Checkout';

import './utils/editable';
import contextify from './utils/contextify';

let history = useQueries(createHistory)();
let store = configureStore();

const sdk = {
  dispatcher: dispatcher,
  actions: dispatcher.actions,
  stores: dispatcher.stores,

  store,
  actionsR: actions,
  actionCreators,
  registerAppReducers,

  history: history,

  services: {
    storefront: storefrontService,
    checkout: new checkoutService()
  },

  connectToStores: connectToStores,
  loadScript: loadScript,
  loadPage: loadPage,
  contextify: contextify,

  init: () => {
    // Set isFirstLoad out to be wrapped on the closure
    let isFirstLoad = true;
    // Set history listener for navigation
    history.listen(location => {
      // This if/else handles the edge cases of person
      // clicking like an absolute madman to go to a URL or
      // clicking on a link that points to the same path
      if (!isFirstLoad) {
        const context = store.getState().SDK.context;
        const previousLocation = context.get('location');
        const previousURL = previousLocation.pathname + previousLocation.search;
        const newURL = location.pathname + location.search;
        const isURLEqual = previousURL === newURL;

        if (context.get('loading') || isURLEqual) {
          return false;
        }
      } else {
        isFirstLoad = false;
      }

      // Signal that we are loading the page
      store.dispatch(actionCreators.context.setLoading(true));
      // Start the route loading cycle!
      loadPage(location, store);
    });

    // Finally, render
    const locale = store.getState().SDK.context.getIn(['culture', 'language']);
    ReactIntl.addLocaleData(ReactIntlLocaleData[locale]);
    ReactDOM.render(
      <Provider store={store}>
        <div>
          <IntlProvider locale={locale}>
            <Root history={history} />
          </IntlProvider>
          <DevTools/>
        </div>
      </Provider>
    , document.getElementById('storefront-container'));
  }
};

export default sdk;
