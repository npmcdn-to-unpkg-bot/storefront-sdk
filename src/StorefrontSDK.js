import 'expose?React!react';
import 'expose?ReactDOM!react-dom';
import 'expose?ReactCSSTransitionGroup!react-addons-css-transition-group';
import 'expose?ReactShallowCompare!react-addons-shallow-compare';
import 'expose?ReactRouter!react-router';
import 'expose?ReactIntl!react-intl';
import 'expose?ReactHelmet!react-helmet';

import map from 'lodash-compat/collection/map';
import { createHistory, useQueries } from 'history';
import { Router, Route } from 'react-router';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';

import dispatcher from './dispatcher/StorefrontDispatcher';
import connectToStores from './utils/connectToStores';
import Price from './utils/Price';
import Img from './utils/Img';
import Area from './components/Area';
import App from './components/App';

import * as storefrontService from 'services/Storefront';

import './utils/editable';

let history = useQueries(createHistory)();

class StorefrontSDK {
  dispatcher = dispatcher;
  actions = dispatcher.actions;
  stores = dispatcher.stores;

  history = history;

  Area = Area;

  services = {
    storefront: storefrontService
  }

  utils = {
    connectToStores,
    Price,
    Img
  }

  init() {
    let components = this.dispatcher.stores.ComponentStore.getState();

    // Create routes based on the declared storefront components
    let children = map(window.storefront.routes, (route, routeName) => {
      let component = components.getIn([route.component, 'constructor']);

      let routeProps = {
        path: route.path,
        component: component,
        key: routeName
      };

      if (process.env.NODE_ENV !== 'production') {
        if (!component) {
          console.error(`Component ${route.component} not found.`);

          const ComponentNotFound = require('./components/ComponentNotFound/ComponentNotFound');
          return <Route {...routeProps} component={ComponentNotFound(routeName, route.component)}/>;
        }
      } else if (!component) {
        return null;
      }

      if (component.onEnter) {
        routeProps.onEnter = component.onEnter;
      }
      if (component.onLeave) {
        routeProps.onLeave = component.onLeave;
      }

      return <Route {...routeProps}/>;
    });

    let wrapper = (
      <Route component={App}>
        {children}
      </Route>
    );

    if (components.get('AppEditor')) {
      let AppEditor = components.getIn(['AppEditor', 'constructor']);
      wrapper = (
        <Route component={AppEditor}>
          {wrapper}
        </Route>
      );
    }

    // Finally, render
    let locale = this.dispatcher.stores.ContextStore.getState().getIn(['culture', 'language']);
    ReactIntl.addLocaleData(ReactIntlLocaleData[locale]);
    ReactDOM.render(
      <IntlProvider locale={locale}>
        <Router history={this.history}>
          {wrapper}
        </Router>
      </IntlProvider>
    , document.getElementById('storefront-container'));
  }
}

let sdk = new StorefrontSDK();

export default sdk;
