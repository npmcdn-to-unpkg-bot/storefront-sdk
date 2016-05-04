import axios from 'axios';
import history from 'history';

const token = ('; ' + document.cookie).split('; VtexIdclientAutCookie=').pop().split(';').shift();
const workspace = ('; ' + document.cookie).split('; vtex_workspace=').pop().split(';').shift();

function getPlaceholderPath({base, currentURL}) {
  const URL = currentURL.replace(/^\//, '');
  const location = history.createLocation(base + URL);
  const { pathname, search } = location;
  const placeholderQuery = search.length === 0 ?
    `?_placeholder=${id}` : `&_placeholder=${id}`;

  return pathname + search + placeholderQuery;
}

export const defaultHeaders = {
  'Authorization': `token ${token}`,
  'x-vtex-workspace': workspace ? workspace : 'master'
};

export function savePlaceholderSettings({id, component, settings}) {
  const url = `/_resources/_settings/${id}`;
  const data = { component, settings };

  return axios.put(url, data, {
    headers: defaultHeaders
  });
}

export function getPlaceholderResources({currentURL, id}) {
  return axios.get(getPlaceholderPath({ base: '/_data/', currentURL }), {
    headers: defaultHeaders
  });
}

export function getPlaceholder({currentURL, id}) {
  return axios.get(getPlaceholderPath({ base: '/_routes/', currentURL }), {
    headers: defaultHeaders
  });
}

export function getPlaceholderSettings({id}) {
  return axios.get(`/_resources/_settings/${id}`, {
    headers: defaultHeaders
  });
}

export function getRouteResources(currentURL) {
  const URL = currentURL.replace(/^\//, '');

  return axios.get(`/_data/${URL}`, {
    headers: defaultHeaders
  });
}

export function getRoute(currentURL) {
  const URL = currentURL.replace(/^\//, '');

  return axios.get(`/_routes/${URL}`, {
    headers: defaultHeaders
  });
}
