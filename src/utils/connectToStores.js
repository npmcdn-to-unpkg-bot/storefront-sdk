import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import isFunction from 'lodash-compat/lang/isFunction';
import keys from 'lodash-compat/object/keys';

/**
 *    import { stores, utils } from 'sdk';
 *
 *    @utils.connectToStores()
 *    class MyComponent extends React.Component {
 *      static getStores(props) {
 *        return [stores.ProductStore]
 *      }
 *
 *      static getPropsFromStores(props) {
 *        return {
 *          product: stores.ProductStore.getState().get(props.params.slug)
 *        };
 *      }
 *
 *      render() {
 *        // Use this.props.product as you like...
 *      }
 *    }
 *
 *    export default MyComponent;
 */

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

function connectToStores() {
  return function decorator(Component) {
    // Check for required static methods.
    if (!isFunction(Component.getStores)) {
      throw new Error('connectToStores() expects the wrapped component to have a static getStores() method');
    }
    if (!isFunction(Component.getPropsFromStores)) {
      throw new Error('connectToStores() expects the wrapped component to have a static getPropsFromStores() method');
    }

    class StoreConnection extends React.Component {
      constructor(props) {
        super(props);

        this.state = Component.getPropsFromStores(props, this.context);

        const stores = Component.getStores(props, this.context);
        this.storesListeners = stores.map((store) => {
          return store.listen(this.onChange);
        });
      }

      componentWillUnmount = () => {
        this.storesListeners.forEach(unlisten => unlisten());
      }

      onChange = () => {
        this.setState(Component.getPropsFromStores(this.props, this.context));
      }

      shouldComponentUpdate = (nextProps, nextState) => {
        return shallowCompare(this, nextProps, nextState);
      }

      render() {
        return (
          <Component {...{...this.props, ...this.state}}/>
        );
      }
    }

    StoreConnection.contextTypes = Component.contextTypes;
    let staticProperties = keys(Component);

    for (let i = 0; i < staticProperties.length; i++) {
      let property = staticProperties[i];
      StoreConnection[property] = Component[property];
    }
    StoreConnection.displayName = `Connected${getDisplayName(Component)}`;

    return StoreConnection;
  };
}

export default connectToStores;
