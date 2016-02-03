import * as storefrontService from 'services/Storefront';

class AreaActions {
  getAreaAssets({id, addLatest = false, retry = false}) {
    storefrontService.getAreaAssets({id})
      .then((response) => {
        if (retry && this.getAreaAssetsInterval) {
          clearInterval(this.getAreaAssetsInterval.ref);
        }

        this.actions.getAreaAssetsSuccess({id, assets: response.data, addLatest});
      })
      .catch((error) => {
        if (retry && error.status === 404) {
          if (!this.getAreaAssetsInterval) {
            this.getAreaAssetsInterval = {
              ref: setInterval(() => {
                this.actions.getAreaAssets(arguments[0]);
              }, 500),
              called: 0
            };
          } else if (this.getAreaAssetsInterval.called === 20) {
            clearInterval(this.getAreaAssetsInterval.ref);
          } else {
            this.getAreaAssetsInterval.called += 1;
          }
        }

        this.actions.getAreaAssetsFail({id, error});
      });

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
}

export default AreaActions;
