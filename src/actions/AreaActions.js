import * as storefrontService from 'services/Storefront';

class AreaActions {
  getAreaAssets({id}) {
    storefrontService.getAreaAssets({id})
      .then((response) => this.actions.getAreaAssetsSuccess({id, assets: response.data}))
      .catch((error) => this.actions.getAreaAssetsFail({id, error}));

    return arguments[0];
  }

  getAreaAssetsSuccess(data) {
    return data;
  }

  getAreaAssetsFail(error) {
    return error;
  }

  saveAreaSettings({id, component, settings}) {
    storefrontService.saveAreaSettings({id, component, settings})
      .then(() => this.actions.saveAreaSettingsSuccess({id, settings}))
      .catch((error) => this.actions.saveAreaSettingsError({id, settings, error}));

    return arguments[0];
  }

  saveAreaSettingsSuccess(data) {
    return data;
  }

  saveAreaSettingsError(error) {
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

    return {currentURL, id, params};
  }

  getAreaResourcesSuccess({currentURL, id, params, resources}) {
    return {currentURL, id, params, resources};
  }

  getAreaResourcesError({currentURL, id, params, error}) {
    return {currentURL, id, params, error};
  }

  getRouteResources(currentURL) {
    storefrontService.getRouteResources(currentURL)
      .then(response => {
        let result = {
          currentURL,
          resources: response.data
        };
        this.actions.getRouteResourcesSuccess(result);
      })
      .catch(error => this.actions.getRouteResourcesFail({currentURL, error}));

    return currentURL;
  }

  getRouteResourcesSuccess({currentURL, resources}) {
    return {currentURL, resources};
  }

  getRouteResourcesFail({currentURL, error}) {
    return {currentURL, error};
  }

  loadPageSuccess(route) {
    return route;
  }
}

export default AreaActions;
