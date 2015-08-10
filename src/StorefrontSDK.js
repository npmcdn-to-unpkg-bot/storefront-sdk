import React from 'expose?React!react/addons';
import ReactMount from 'expose?ReactMount!react/lib/ReactMount'; // eslint-disable-line
import ReactRouter, { Route } from 'expose?ReactRouter!react-router';
import Intl from 'expose?Intl!intl'; // eslint-disable-line
import ReactIntl from 'expose?ReactIntl!react-intl'; // eslint-disable-line
import jQuery from 'expose?jQuery!jquery'; // eslint-disable-line
import map from 'lodash/collection/map';
import dispatcher from './dispatcher/StorefrontDispatcher';
import connectToStores from './utils/connectToStores.js';

let rootInstance;

class StorefrontSDK {
  connectToStores = connectToStores;
  dispatcher = dispatcher;

  createRouter() {
    let components = this.dispatcher.stores.ComponentStore.getState();

    let children = map(window.storefront.routes, (route, routeName) => {
      let component = components.getIn([route.component, 'constructor']);
      return <Route name={routeName} key={routeName} path={route.path} handler={component} />;
    });

    let handler;
    if (components.get('AppEditor')) {
      handler = components.getIn(['AppEditor', 'constructor']);
    } else {
      handler = components.getIn(['App', 'constructor']);
    }

    let routes = (
      <Route handler={handler}>
        {children}
      </Route>
    );
    // TODO check browser support, degrade to hash
    return ReactRouter.create({routes, location: ReactRouter.HistoryLocation});
  }

  // Enable react hot loading with external React
  // see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react
  enableHotLoad() {
    if (window.RootInstanceProvider) {
      window.RootInstanceProvider.injectProvider({
        getRootInstances() {
          return [rootInstance];
        }
      });
    }
  }

  init() {
    this.router = this.createRouter();
    let locale = this.dispatcher.stores.ShopStore.getState().get('locale');
    this.router.run((Handler) =>
      rootInstance = React.render((
        <Handler messages={window.storefront.i18n} locales={locale}/>
      ), document.getElementById('storefront-container'))
    );
    this.enableHotLoad();
  }
}

let storefront = new StorefrontSDK();

export default storefront;