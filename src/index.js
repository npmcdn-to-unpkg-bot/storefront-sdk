import sdk from 'expose?storefront.sdk!./StorefrontSDK';
import actions from './actions';
import stores from './stores';
import map from 'lodash-compat/collection/map';
import Price from './components/Price';
import Img from './components/Img';
import Link from './components/Link';
import Placeholder from './components/Placeholder';
import contextify from './utils/contextify';

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
    name: 'Link@vtex.storefront-sdk',
    constructor: Link
  },
  {
    name: 'Placeholder@vtex.storefront-sdk',
    constructor: contextify()(Placeholder)
  },
  {
    name: 'PurePlaceholder@vtex.storefront-sdk',
    constructor: Placeholder
  }
];

sdk.dispatcher.actions.ComponentActions.register(components);
