import React from 'react';
import dispatcher from '../../dispatcher/StorefrontDispatcher';
import shallowCompare from 'react-addons-shallow-compare';
import mergeDeep from 'utils/mergeDeep';
import droppable from 'utils/droppable';
<<<<<<< HEAD:src/components/Placeholder.js
import keys from 'lodash-compat/object/keys';
import { isImplementsEqual } from 'utils/implements';
=======
//import keys from 'lodash-compat/object/keys';
import isImplementsEqual from 'utils/implements';
>>>>>>> Add style for default placeholder on hover (WIP):src/components/Placeholder/Placeholder.js
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Placeholder.less';

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

@droppable()
class Placeholder extends React.Component {
  constructor(props) {
    super(props);

    if (!props.id) {
      console.error('Placeholder: required prop "id" not defined');
    }

    this.state = {
      ...this.getDataFromStores(props),
      loading: false,
      openEditorId: ''
    };

    dispatcher.stores.SettingsStore.listen(this.onChange);
    dispatcher.stores.ComponentStore.listen(this.onChange);
    dispatcher.stores.EditorStore.listen(this.onComponentChange);
  }

  componentWillUnmount = () => {
    dispatcher.stores.SettingsStore.unlisten(this.onChange);
    dispatcher.stores.ComponentStore.unlisten(this.onChange);
    dispatcher.stores.EditorStore.unlisten(this.onComponentChange);
  }

  getDataFromStores = (props) => {
    const componentSettings = dispatcher.stores.SettingsStore.getState().get(props.parentId);

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

  onComponentChange = (editorStore) => {
    const editor = editorStore.get('editor');
    const componentProps = editor ? editor.get('componentProps') : '';
    this.setState(
      {
        selectedComponent: editorStore.get('selectedComponent'),
        openEditorId: componentProps.id
      }
    );
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      isDragging,
      connectDropTarget,
      parentId,
      id,
      droppable,
      component,
      selectedComponent,
      components
    } = this.props;

    if (this.state.openEditorId === parentId) {
      console.log('ESTOU EDITANDO O COMPONENTE', this.state.openEditorId);
    }

    if (this.state.loading) {
      return (
        <div className="Placeholder clearfix" data-is-dropping={true}>
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
      isDragging,
      connectDropTarget,
      parentId,
      id,
      droppable,
      //component,
      selectedComponent,
      components
    } = this.props;

    const settings = mergeDeep(this.state.settings, this.props.settings);
    const Component = this.state.component;

    const isSelected = isDragging || this.state.selectedComponent ? true : false;

    const newParentId = parentId.substr(0, parentId.indexOf(`/${id}`));
    const isComponentEqual = isImplementsEqual(components, id, selectedComponent, newParentId, 'home');

    const dataAttrs = droppable ?
      {
        'data-is-dragging': isSelected,
        'data-is-match': isComponentEqual,
        'data-is-editing': true
      } : {} ;

    if (!Component) {
      if (droppable) dataAttrs['data-is-empty'] = true;

      const content = (
        <div className="Placeholder clearfix" {...dataAttrs} />
      );

      return droppable ? connectDropTarget(content) : content;
    }

    const content = (
      <div className="Placeholder clearfix" {...dataAttrs}>
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

export default Placeholder;
