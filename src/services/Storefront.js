import axios from 'axios';

const token = ('; ' + document.cookie).split('; VtexIdclientAutCookie=').pop().split(';').shift();
const workspace = ('; ' + document.cookie).split('; vtex_workspace=').pop().split(';').shift();

export const defaultHeaders = {
  'Authorization': `token ${token}`,
  'x-vtex-workspace': workspace ? workspace : 'master'
};

export function saveAreaSettings({id, component, settings}) {
  const url = `/_resources/_settings/${id}`;
  const data = { component, settings };

  return axios.put(url, data, {
    headers: defaultHeaders
  });
}

export function getAreaResources({id, params, query}) {
  let reqParams = {};

  for (let key in query) {
    reqParams[`query.${key}`] = query[key];
  }

  for (let key in params) {
    reqParams[`route.${key}`] = params[key];
  }

  return axios.get(`/_areas/${id}/_resources/`, {
    headers: defaultHeaders,
    params: reqParams
  });
}

export function getAreaAssets({id}) {
  return axios.get(`/_areas/${id}/_assets/`, {
    headers: defaultHeaders
  });
}

export function getAreaSettings({id}) {
  return axios.get(`/_resources/_settings/${id}`, {
    headers: defaultHeaders
  });
}
