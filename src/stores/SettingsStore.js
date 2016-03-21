import Immutable from 'immutable';
import immutable from 'alt/utils/ImmutableUtil';

function getDataFromResources(state, resources) {
  if (resources._settings) {
    let settings = {};

    for (let i = 0; i < resources._settings.length; i++) {
      settings[resources._settings[i].area] = resources._settings[i].data;
    }

    return state.merge(Immutable.fromJS(settings));
  }
  return state;
}

@immutable
class SettingsStore {
  constructor(dispatcher) {
    this.bindActions(dispatcher.actions.AreaActions);

    this.state = getDataFromResources(Immutable.Map(), window.storefront.currentRoute.resources);
  }

  onSaveAreaSettings({id, component, settings}) {
    // Here we are doing an optmistic update. The data is not saved on the
    // server yet, but it probably will.
    this.oldState = this.state;
    this.setState(this.state.set(id, Immutable.Map({ component, settings })));
  }

  onSaveAreaSettingsFail(error) {
    // If the server cant update the settings, we go back to the previous state.
    console.warn('Error while saving settings', error);
    this.setState(this.oldState);
  }

  onGetAreaResourcesSuccess({resources}) {
    this.setState(getDataFromResources(this.state, resources));
  }

  onGetRouteResourcesSuccess({resources}) {
    this.setState(getDataFromResources(this.state, resources.resources));
  }
}

export default SettingsStore;
