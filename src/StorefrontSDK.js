import 'expose?React!react';
import 'expose?ReactDOM!react-dom';
import 'expose?ReactCSSTransitionGroup!react-addons-css-transition-group';
import 'expose?ReactShallowCompare!react-addons-shallow-compare';
import 'expose?ReactIntl!react-intl';
import 'expose?ReactHelmet!react-helmet';

import { createHistory, useQueries } from 'history';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';

import dispatcher from './dispatcher/StorefrontDispatcher';
import connectToStores from './utils/connectToStores';
import Root from './components/Root';
import { loadScript, loadPage } from './utils/loadPage';

import * as storefrontService from 'services/Storefront';

import './utils/editable';
import contextify from './utils/contextify';

const history = useQueries(createHistory)();

class StorefrontSDK {
  dispatcher = dispatcher;
  actions = dispatcher.actions;
  stores = dispatcher.stores;

  history = history;

  services = {
    storefront: storefrontService
  }

  connectToStores = connectToStores
  loadScript = loadScript
  loadPage = loadPage
  contextify = contextify

  init = () => {
    // Set history listener for navigation
    history.listen(location => {
      // Update the location
      dispatcher.actions.ContextActions.changeLocation(location);
      const currentURL = location.pathname + location.search;

      // Start the route loading cycle!
      if (location.action === 'POP') {
        // If there's a POP action, then we already have the assets
        // so we ignore loading the scripts by passing true
        // on the third parameter
        loadPage(currentURL, dispatcher, true);
      } else {
        // It's a push or replace action, then we load the scripts
        loadPage(currentURL, dispatcher);
      }
    });

    // Finally, render
    const locale = this.dispatcher.stores.ContextStore.getState().getIn(['culture', 'language']);
    ReactIntl.addLocaleData(ReactIntlLocaleData[locale]);
    ReactDOM.render(
      <IntlProvider locale={locale}>
        <Root history={history} />
      </IntlProvider>
    , document.getElementById('storefront-container'));
  }
}

const sdk = new StorefrontSDK();

export default sdk;
