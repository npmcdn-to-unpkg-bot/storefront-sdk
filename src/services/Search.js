import axios from 'axios';
import { omit } from 'lodash-compat/object';

class Search {
  static productResource = '/_resources/product@vtex.storefront-sdk/'
  static productsResource = '/_resources/products@vtex.storefront-sdk/'

  static products(params) {
    params = omit(params, ['$id']);

    if (params.product) {
      return axios.get(this.productResource, { params: params });
    } else {
      return axios.get(this.productsResource, { params: params });
    }
  }

  static facets(params) {
    params = omit(params, ['$id']);

    const url = this.productsResource + '/facets';

    return axios.get(url, { params: params });
  }

  static categories(params) {
    params = omit(params, ['$id']);

    const categoryId = params.category ? params.category : '';
    const url = this.productsResource + '/categories/' + categoryId;

    return axios.get(url);
  }
}

export default Search;
