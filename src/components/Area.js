import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Area.less';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import shallowCompare from 'react-addons-shallow-compare';
import mergeDeep from 'utils/mergeDeep';
import droppable from 'utils/droppable';

/**
 *  <Area id="home/banner"/>
 *  It will render the component saved at "home/banner" passing its
 *  settings as props.
 *
 *  You can also fix a component to be rendered:
 *  <Area component="Banner@vtex.storefront-theme" id="home/banner"/>
 *  It will *always* render the component `Banner@vtex.storefront-theme`,
 *  you need to make sure to have its assets added in the page though.
 *  Storefront won't make that for you.
 *
 *  You can also pass some fixed settings that will override the saved
 *  settings:
 *  <Area id="home/banner" settings={{title: 'Hi!'}}/>
 *
 *  Or, you can ignore the prop "id" and make everything fixed:
 *  <Area component="Banner@vtex.storefront-theme" settings={{title: 'Hi'}}/>
 */

@droppable()
class Area extends React.Component {
  constructor(props) {
    super(props);

    if (!props.id) {
      console.error('Area: required prop "id" not defined');
    }

    this.state = {
      ...this.getDataFromStores(props),
      loading: false
    };

    dispatcher.stores.SettingsStore.listen(this.onChange);
    dispatcher.stores.ComponentStore.listen(this.onChange);
    dispatcher.stores.EditorStore.listen(this.onIntentionChange);
  }

  componentWillUnmount = () => {
    dispatcher.stores.SettingsStore.unlisten(this.onChange);
    dispatcher.stores.ComponentStore.unlisten(this.onChange);
    dispatcher.stores.EditorStore.listen(this.onIntentionChange);
  }

  getDataFromStores = (props) => {
    const SettingsStore = dispatcher.stores.SettingsStore.getState();
    const componentSettings = SettingsStore.get(props.id);

    if (!componentSettings) {
      return { settings: null, component: null };
    }

    const settings = componentSettings.get('settings');
    const componentName = props.component || componentSettings.get('component');
    const ComponentStore = dispatcher.stores.ComponentStore.getState();
    const component = ComponentStore.getIn([componentName, 'constructor']);

    if (!component) {
      if (typeof props.component !== 'undefined' && typeof props.component !== 'string') {
        console.warn(`Area: "component" prop should be a component locator (eg: ComponentName@vendor.appName)`);
      } else {
        console.warn(`Area: Could not find component ${componentName}`);
      }
    }

    return {
      component,
      settings: settings || Immutable.Map()
    };
  }

  onChange = () => {
    this.setState(this.getDataFromStores(this.props));
  }

  onIntentionChange = (editorStore) => {
    this.setState({ selectedIntention: editorStore.get('selectedIntention') });
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="AreaSDK">
          <div className="sk-fading-circle">
            <div className="sk-circle1 sk-circle" />
            <div className="sk-circle2 sk-circle" />
            <div className="sk-circle3 sk-circle" />
            <div className="sk-circle4 sk-circle" />
            <div className="sk-circle5 sk-circle" />
            <div className="sk-circle6 sk-circle" />
            <div className="sk-circle7 sk-circle" />
            <div className="sk-circle8 sk-circle" />
            <div className="sk-circle9 sk-circle" />
            <div className="sk-circle10 sk-circle" />
            <div className="sk-circle11 sk-circle" />
            <div className="sk-circle12 sk-circle" />
          </div>
        </div>
      );
    }

    const {
      compIntention,
      isDragging,
      connectDropTarget,
      intention,
      droppable
    } = this.props;
    const Component = this.state.component;
    const settings = mergeDeep(this.state.settings, this.props.settings);
    const componentIntention = compIntention || this.state.selectedIntention;
    const isSelected = isDragging || componentIntention ? true : false;
    const isIntentionEqual = componentIntention ?
      componentIntention === intention : false;
    const dataAttrs = droppable ?
      {
        'data-is-empty': false,
        'data-is-dragging': isSelected,
        'data-is-match': isIntentionEqual
      } : {} ;

    if (!Component) {
      if (droppable) dataAttrs['data-is-empty'] = true;

      const content = (
        <div className="AreaSDK" {...dataAttrs} />
      );

      return droppable ? connectDropTarget(content) : content;
    }

    const content = (
      <div className="AreaSDK" {...dataAttrs}>
        <ReactCSSTransitionGroup
          transitionName="componentTransition"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          <Component
            {...this.props}
            settings={settings.isEmpty() ? null : settings}
          />
        </ReactCSSTransitionGroup>
      </div>
    );

    return droppable ? connectDropTarget(content) : content;
  }
}

export default Area;
