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
      // Signal that we are loading the page
      dispatcher.actions.ContextActions.setLoading(true);
      // Start the route loading cycle!
      loadPage(location, dispatcher);
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
