import axios from 'axios';

class Storefront {
  constructor() {
    let token = ('; ' + document.cookie).split('; VtexIdclientAutCookie=').pop().split(';').shift();
    let workspace = ('; ' + document.cookie).split('; vtex_workspace=').pop().split(';').shift();

    this.defaultHeaders = {
      'Authorization': `token ${token}`,
      'x-vtex-workspace': workspace ? workspace : 'master'
    };
  }

  saveAreaSettings({id, component, settings}) {
    const url = `/_resources/_settings/${id}`;
    const data = { component, settings };

    return axios.put(url, data, {
      headers: this.defaultHeaders
    });
  }

  getAreaResources({id, params, query}) {
    let reqParams = {};

    for (let key in query) {
      reqParams[`query.${key}`] = query[key];
    }

    for (let key in params) {
      reqParams[`route.${key}`] = params[key];
    }

    return axios.get(`/_areas/${id}/_resources/`, {
      headers: this.defaultHeaders,
      params: reqParams
    });
  }

  getAreaSettings({id}) {
    return axios.get(`/_resources/_settings/${id}`, {
      headers: this.defaultHeaders
    });
  }
}

export default Storefront;
