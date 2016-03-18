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
  static contextTypes = {
    parentId: React.PropTypes.string
  }

  static childContextTypes = {
    parentId: React.PropTypes.string
  }

  getChildContext() {
    return { parentId: this.state.fullId };
  }

  componentWillMount() {
    if (!this.props.id) {
      console.error('Placeholder: required prop "id" not defined');
    }

    this.state = this.getDataFromStores(this.props, this.context);

    dispatcher.stores.SettingsStore.listen(this.onChange);
    dispatcher.stores.ComponentStore.listen(this.onChange);
  }

  componentWillReceiveProps(props, context) {
    this.setState(this.getDataFromStores(props, context));
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const currentParentId = this.context && this.context.parentId;
    const nextParentId = nextContext && nextState.parentId;
    const isParentIdEqual = currentParentId === nextParentId;

    return !isParentIdEqual || shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    dispatcher.stores.SettingsStore.unlisten(this.onChange);
    dispatcher.stores.ComponentStore.unlisten(this.onChange);
  }

  getPlaceholderId = (props, context) => {
    let id = props.id;

    if (context.parentId) {
      id = context.parentId + '/' + id;
    }

    return id;
  }

  getDataFromStores = (props, context) => {
    const id = this.getPlaceholderId(props, context);
    const componentSettings = dispatcher.stores.SettingsStore.getState().get(id);

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
      component: component,
      fullId: id
    };
  }

  onChange = () => {
    this.setState(this.getDataFromStores(this.props, this.context));
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
        id={this.state.fullId}
        settings={settings.isEmpty() ? null : settings}
      />
    );
  }
}

export default Placeholder;
