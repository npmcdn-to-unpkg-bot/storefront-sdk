import Storefront from 'services/Storefront';

let storefrontService = new Storefront();

class ResourceActions {

  saveSettings({id, component, settings}) {
    storefrontService.saveAreaSettings({id, component, settings})
      .then(() => this.actions.saveSettingsSuccess({id, settings}))
      .catch((error) => this.actions.saveSettingsError({id, settings, error}));

    return arguments[0];
  }

  saveSettingsSuccess(data) {
    return data;
  }

  saveSettingsError(error) {
    return error;
  }

  getAreaResources({currentURL, id, params = {}, query = {}}) {

    storefrontService.getAreaResources({id, params, query})
    .then((response) => {
      let result = {
        currentURL,
        id,
        params,
        resources: response.data.resources
      };
      this.actions.getAreaResourcesSuccess(result);
    }).catch((error) =>
      this.actions.getAreaResourcesError({currentURL, id, params, error})
    );

    return {currentURL, area, params};
  }

  getAreaResourcesSuccess({currentURL, area, params, resources}) {
    return {currentURL, area, params, resources};
  }

  getAreaResourcesError({currentURL, area, params, error}) {
    return {currentURL, area, params, error};
  }
}

export default ResourceActions;
