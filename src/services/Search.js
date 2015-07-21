import jQuery from 'jQuery';
import _extend from 'lodash/object/extend';
import _omit from 'lodash/object/omit';
import constants from './constants.js';

class Search {

  static products(params) {
    let url = constants.BASE_URL + params.accountName + '/products/' + (params.product || '');

    let props = {
      url: url,
      data: _omit(params, ['accountName', 'product', 'id'])
    };

    return jQuery.ajax(_extend({}, constants.SEARCH_AJAX, props));
  }

  static facets(params) {
    let url = constants.BASE_URL + params.accountName + '/facets';

    let props = {
      url: url,
      data: _omit(params, ['accountName'])
    };

    return jQuery.ajax(_extend({}, constants.SEARCH_AJAX, props));
  }

  static categories(params) {
    let categoryId = params.category ? params.category : '';
    let url = constants.BASE_URL + params.accountName + '/categories/' + categoryId;

    let props = {
      url: url
    };

    return jQuery.ajax(_extend({}, constants.SEARCH_AJAX, props));
  }

}

export default Search;
