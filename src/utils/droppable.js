import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import { DropTarget } from 'react-dnd';
import { DnDConstants } from 'utils/DnDConstants';
import { isAlreadyInstancied, isImplementsEqual } from '../utils/implements';

const { ItemTypes } = DnDConstants;

const openEditor = (component, props) => {
  const EditorActions = dispatcher.actions.EditorActions;
  EditorActions.openEditor({
    component: component,
    componentProps: props
  });
};

const editorContainerTarget = {
  drop(props, monitor, component) {
    const AssetStore = dispatcher.stores.AssetStore;
    const SettingsStore = dispatcher.stores.SettingsStore;
    const AreaActions = dispatcher.actions.AreaActions;

    const { components, parentId } = props;
    const selectedComponent = monitor.getItem().component;

    if (isAlreadyInstancied(components, parentId, selectedComponent)) {
      const settings = {
        settings: component.state.settings,
        id: parentId
      };

      openEditor(monitor.getItem().component, settings);

      const installPromise = new Promise(resolve => { resolve(); });
      return { installPromise };
    }

    const settings = {
      ...monitor.getItem(),
      id: component.props.parentId
    };

    openEditor(monitor.getItem().component, settings);

    const assetListener = (resolve) => {
      const assetListenerWithResolve = (assets) => {
        const newAreaAssets = assets.get(props.id);
        const loading = newAreaAssets ? newAreaAssets.get('loading') : false;

        if (newAreaAssets && !loading) {
          AssetStore.unlisten(assetListenerWithResolve);
          resolve();
        }
      };

      return assetListenerWithResolve;
    };

    const settingsListener = (settings) => {
      const newAreaSettings = settings.getIn([props.id, 'component']);
      const component = monitor.getItem().component;

      if (newAreaSettings === component) {
        AreaActions.getAreaAssets({ id: props.id, addLatest: true, retry: true });
        SettingsStore.unlisten(settingsListener);
      }
    };

    SettingsStore.listen(settingsListener);

    const installPromise = new Promise(resolve => {
      AssetStore.listen(assetListener(resolve));
    });

    component.setState({ loading: true });

    AreaActions.saveAreaSettings(settings);

    return { installPromise };
  },

  canDrop(props, monitor) {
    const item = monitor.getItem();
    const { id, parentId, components } = props;
    const newParentId = parentId.substr(0, parentId.indexOf(`/${id}`));

    const selectedComponent = item != null ? item.component : item;
    return isImplementsEqual(components, id, selectedComponent, newParentId, 'home');
  }
};

const collect = (connect, monitor) => {
  const item = monitor.getItem();
  const component = item != null ? item.component : item;

  return {
    connectDropTarget: connect.dropTarget(),
    selectedComponent: component,
    isDragging: monitor.getClientOffset() !== null
  };
};

const droppable = () => {
  return (Component) => {
    class DroppableComponent extends React.Component {
      static contextTypes = {
        parentId: React.PropTypes.string
      };

      static childContextTypes = {
        parentId: React.PropTypes.string
      };

      getChildContext() {
        return { parentId: this.state.fullId };
      }

      componentWillMount() {
        const AppsStore = dispatcher.stores.AppsStore.getState();
        const components = AppsStore.get('components');

        this.setState({
          droppable: this.isDroppable(),
          fullId: this.getPlaceholderId(this.props, this.context),
          components: components
        });
      }

      componentDidMount() {
        dispatcher.stores.AppsStore.listen(this.onChange);
        dispatcher.stores.ComponentStore.listen(this.onChange);
      }

      componentWillReceiveProps(nextProps, nextContext) {
        const AppsStore = dispatcher.stores.AppsStore.getState();
        const components = AppsStore.get('components');

        this.setState({
          fullId: this.getPlaceholderId(nextProps, nextContext),
          components: components
        });
      }

      componentWillUnmount() {
        dispatcher.stores.AppsStore.unlisten(this.onChange);
        dispatcher.stores.ComponentStore.unlisten(this.onChange);
      }

      onChange = () => {
        this.setState({ droppable: this.isDroppable() });
      }

      isDroppable = () => {
        const ComponentStore = dispatcher.stores.ComponentStore.getState();
        const AppEditor = ComponentStore.getIn(['AppEditor', 'constructor']).toString();
        const droppable = /^function\sDragDropContextContainer/.test(AppEditor);

        return droppable;
      }

      getPlaceholderId = (props, context) => {
        let id = props.id;

        if (context.parentId) {
          id = context.parentId + '/' + id;
        }

        return id;
      }

      render() {
        const { droppable, components } = this.state;

        const DecoratedComponent = droppable ?
          DropTarget(ItemTypes.EDITOR_ITEM, editorContainerTarget, collect)(Component) :
          Component;

        return (
          <DecoratedComponent
            {...this.props}
            components={components}
            parentId={this.state.fullId}
            droppable={droppable}
          />
        );
      }
    }

    return DroppableComponent;
  };
};

export default droppable;
