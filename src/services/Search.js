import axios from 'axios';
import omit from 'lodash-compat/object/omit';

class Search {
  constructor() {
    let token = ('; ' + document.cookie).split('; VtexIdclientAutCookie=').pop().split(';').shift();
    let workspace = ('; ' + document.cookie).split('; vtex_workspace=').pop().split(';').shift();
    let accountName = global._storefront.context.accountName;

    this.defaultHeaders = {
      'Authorization': `token ${token}`,
      'x-vtex-workspace': workspace ? workspace : 'master'
    };

    this.productResource = `/_resources/search@vtex.storefront-sdk/${accountName}/product`;
    this.productsResource = `/_resources/search@vtex.storefront-sdk/${accountName}/products`;
  }

  product(product) {
    return axios.get(this.productResource, {
      params: { product },
      header: this.defaultHeaders
    });
  }

  products(params) {
    params = omit(params, ['$id']);

    return axios.get(this.productsResource, {
      params,
      headers: this.defaultHeaders
    });
  }

  facets(params) {
    params = omit(params, ['$id']);

    const url = this.productsResource + '/facets';

    return axios.get(url, {
      params,
      headers: this.defaultHeaders
    });
  }

  categories(params) {
    params = omit(params, ['$id']);

    const categoryId = params.category ? params.category : '';
    const url = this.productsResource + '/categories/' + categoryId;

    return axios.get(url);
  }
}

export default Search;
