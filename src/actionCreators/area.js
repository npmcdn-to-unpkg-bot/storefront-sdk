import area from '../constants/area';
import * as storefrontService from 'services/Storefront';

export function getAreaAssets({id}) {
  return (dispatch) => {
    storefrontService.getAreaAssets({id})
      .then((response) => dispatch(getAreaAssetsSuccess({id, assets: response.data})))
      .catch((error) => dispatch(getAreaAssetsFail({id}, error)));

    dispatch(getAreaAssetsRequest(arguments[0]));
  };
}

export function getAreaAssetsRequest(payload) {
  return {
    type: area.GET_AREA_ASSETS_REQUEST,
    payload
  };
}

export function getAreaAssetsSuccess(payload) {
  return {
    type: area.GET_AREA_ASSETS_SUCCESS,
    payload
  };
}

export function getAreaAssetsFail(meta, error) {
  return {
    type: area.GET_AREA_ASSETS_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}

export function saveAreaSettings({id, component, settings}) {
  return (dispatch) => {
    storefrontService.saveAreaSettings({id, component, settings})
      .then(() => dispatch(saveSettingsSuccess({id, settings})))
      .catch((error) => dispatch(saveSettingsFail({id, settings}, error)));

    dispatch(saveSettingsRequest(arguments[0]));
  };
}

function saveSettingsRequest(payload) {
  return {
    type: area.SAVE_SETTINGS_REQUEST,
    payload
  };
}

function saveSettingsSuccess(payload) {
  return {
    type: area.SAVE_SETTINGS_SUCCESS,
    payload
  };
}

function saveSettingsFail(meta, error) {
  return {
    type: area.SAVE_SETTINGS_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}

export function getAreaResources({currentURL, id, params = {}, query = {}}) {
  return (dispatch) => {
    storefrontService.getAreaResources({id, params, query})
      .then((response) => {
        dispatch(getAreaResourcesSuccess({
          currentURL,
          id,
          params,
          resources: response.data.resources
        }));
      })
      .catch((error) => dispatch(getAreaResourcesFail(arguments[0], error)));

    dispatch(getAreaResourcesRequest(arguments[0]));
  };
}

export function getAreaResourcesRequest(payload) {
  return {
    type: area.GET_AREA_RESOURCES_REQUEST,
    payload
  };
}

export function getAreaResourcesSuccess(payload) {
  return {
    type: area.GET_AREA_RESOURCES_SUCCESS,
    payload
  };
}

export function getAreaResourcesFail(meta, error) {
  return {
    type: area.GET_AREA_RESOURCES_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}

export function getRouteResources(currentURL, location) {
  return (dispatch) => {
    storefrontService.getRouteResources(currentURL)
      .then(response => {
        let result = {
          currentURL,
          location,
          resources: response.data
        };
        dispatch(getRouteResourcesSuccess(result));
      })
      .catch(error => dispatch(getRouteResourcesFail({currentURL, location}, error)));

    dispatch(getRouteResourcesRequest(currentURL, location));
  };
}

export function getRouteResourcesRequest(currentURL, location) {
  return {
    type: area.GET_ROUTE_RESOURCES_REQUEST,
    payload: {
      currentURL,
      location
    }
  };
}

export function getRouteResourcesSuccess(payload) {
  return {
    type: area.GET_ROUTE_RESOURCES_SUCCESS,
    payload
  };
}

export function getRouteResourcesFail(meta, error) {
  return {
    type: area.GET_ROUTE_RESOURCES_FAIL,
    payload: new Error(error),
    error: true,
    meta
  };
}
