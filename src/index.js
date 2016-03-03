import sdk from 'expose?storefront.sdk!./StorefrontSDK';
import actions from './actions';
import stores from './stores';
import map from 'lodash-compat/collection/map';
import Price from './components/Price';
import Img from './components/Img';
import Area from './components/Area';
import Root from './components/Root';
import Placeholder from './components/Placeholder';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Register all actions and stores
map(actions, (action) => sdk.dispatcher.addActions(action.name, action.obj));
map(stores, (store) => sdk.dispatcher.addStore(store.name, store.obj, sdk.dispatcher));

// Register components
const components = [
  {
    name: 'Price@vtex.storefront-sdk',
    constructor: Price
  },
  {
    name: 'Img@vtex.storefront-sdk',
    constructor: Img
  },
  {
    name: 'Area@vtex.storefront-sdk',
    constructor: Area
  },
  {
    name: 'Root@vtex.storefront-sdk',
    constructor: Root
  },
  {
    name: 'Placeholder@vtex.storefront-sdk',
    constructor: Placeholder
  }
];

sdk.dispatcher.actions.ComponentActions.register(components);
