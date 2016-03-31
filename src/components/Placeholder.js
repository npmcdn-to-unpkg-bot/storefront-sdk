import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import shallowCompare from 'react-addons-shallow-compare';
import mergeDeep from 'utils/mergeDeep';

/**
 *  <Placeholder id="banner"/>
 *  It will render the component saved at "banner" passing its
 *  settings as props.
 *
 *  You can also fix a component to be rendered:
 *  <Placeholder component="Banner@vtex.storefront-theme" id="banner"/>
 *  It will *always* render the component `Banner@vtex.storefront-theme`,
 *  you need to make sure to have its assets added in the page though.
 *  Storefront won't make that for you.
 *
 *  You can also pass some fixed settings that will override the saved
 *  settings:
 *  <Placeholder id="banner" settings={{title: 'Hi!'}}/>
 *
 *  Or, you can ignore the prop "id" and make everything fixed:
 *  <Placeholder component="Banner@vtex.storefront-theme" settings={{title: 'Hi'}}/>
 */

class Placeholder extends React.Component {
  componentWillMount() {
    if (!this.props.id) {
      console.error('Placeholder: required prop "id" not defined');
    }

    this.state = this.getDataFromStores(this.props);

    dispatcher.stores.SettingsStore.listen(this.onChange);
    dispatcher.stores.ComponentStore.listen(this.onChange);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getDataFromStores(props));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    dispatcher.stores.SettingsStore.unlisten(this.onChange);
    dispatcher.stores.ComponentStore.unlisten(this.onChange);
  }

  getDataFromStores = (props) => {
    const componentSettings = dispatcher.stores.SettingsStore.getState().get(props.id);

    if (!componentSettings) {
      return { setings: null, component: null };
    }

    const settings = componentSettings.get('settings');
    const componentName = props.component ? props.component : componentSettings.get('component');
    const component = dispatcher.stores.ComponentStore.getState().getIn([componentName, 'constructor']);

    if (!component) {
      if (typeof props.component !== 'undefined' && typeof props.component !== 'string') {
        console.warn(`Placeholder: "component" prop should be a component locator (eg: ComponentName@vendor.appName)`);
      } else {
        console.warn(`Placeholder: Could not find component ${componentName}`);
      }
    }

    return {
      settings: settings ? settings : Immutable.Map(),
      component: component
    };
  }

  onChange = () => {
    this.setState(this.getDataFromStores(this.props));
  }

  render() {
    const settings = mergeDeep(this.state.settings, this.props.settings);
    const Component = this.state.component;

    if (!Component) {
      return null;
    }

    return (
      <Component
        {...this.props}
        settings={settings.isEmpty() ? null : settings}
      />
    );
  }
}

export default Placeholder;
