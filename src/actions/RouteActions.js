import * as storefrontService from 'services/Storefront';

class RouteActions {
  savePlaceholderSettings({id, component, settings}) {
    storefrontService.savePlaceholderSettings({id, component, settings})
      .then(() => this.actions.savePlaceholderSettingsSuccess({id, settings}))
      .catch((error) => this.actions.savePlaceholderSettingsFail({id, settings, error}));

    return arguments[0];
  }

  savePlaceholderSettingsSuccess(data) {
    return data;
  }

  savePlaceholderSettingsFail(error) {
    return error;
  }

  getPlaceholderResources({currentURL, id}) {
    storefrontService.getPlaceholderResources({currentURL, id})
      .then((response) => {
        let result = {
          currentURL,
          id,
          resources: response.data.resources
        };
        this.actions.getPlaceholderResourcesSuccess(result);
      }).catch((error) =>
        this.actions.getPlaceholderResourcesFail({currentURL, id, error})
      );

    return {currentURL, id};
  }

  getPlaceholderResourcesSuccess({currentURL, id, resources}) {
    return {currentURL, id, resources};
  }

  getPlaceholderResourcesFail({currentURL, id, error}) {
    return {currentURL, id, error};
  }

  getPlaceholder({currentURL, id}) {
    storefrontService.getPlaceholder({currentURL, id})
      .then((response) => {
        let result = {
          currentURL,
          id,
          resources: response.data.resources
        };
        this.actions.getPlaceholderSuccess(result);
      }).catch((error) =>
        this.actions.getPlaceholderFail({currentURL, id, error})
      );

    return {currentURL, id};
  }

  getPlaceholderSuccess({currentURL, id, resources}) {
    return {currentURL, id, resources};
  }

  getPlaceholderFail({currentURL, id, error}) {
    return {currentURL, id, error};
  }

  getRouteResources(currentURL, location) {
    storefrontService.getRouteResources(currentURL)
      .then(response => {
        let result = {
          currentURL,
          location,
          resources: response.data
        };
        this.actions.getRouteResourcesSuccess(result);
      })
      .catch(error => this.actions.getRouteResourcesFail({currentURL, error}));

    return currentURL;
  }

  getRouteResourcesSuccess({currentURL, location, resources}) {
    return {currentURL, location, resources};
  }

  getRouteResourcesFail({currentURL, error}) {
    return {currentURL, error};
  }

  getRoute(currentURL, location) {
    storefrontService.getRoute(currentURL)
      .then(response => {
        let result = {
          currentURL,
          location,
          resources: response.data
        };
        this.actions.getRouteSuccess(result);
      })
      .catch(error => this.actions.getRouteFail({currentURL, error}));

    return currentURL;
  }

  getRouteSuccess({currentURL, location, resources}) {
    return {currentURL, location, resources};
  }

  getRouteFail({currentURL, error}) {
    return {currentURL, error};
  }
}

export default RouteActions;
