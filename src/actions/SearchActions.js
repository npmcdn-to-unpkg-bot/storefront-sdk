import Search from 'services/Search';

const search = new Search();

class SearchActions {
  requestSearch(params) {
    // params should be an immutable object
    if (!params.toJS) {
      return params;
    }

    // Call API with query parameter
    search.products(params.toJS())
      .then((response) => this.actions.requestSearchSuccess({ params, products: response.data }))
      .catch((error) => this.actions.requestSearchFail({ params, error }));

    return params;
  }

  requestSearchSuccess(results) {
    return results;
  }

  requestSearchFail(error) {
    return error;
  }

  requestFacets(params) {
    // Call API with query parameter
    search.facets(params)
      .then((result) => {
        const results = result.data;
        this.actions.requestFacetsSuccess({ params, results });
      })
      .catch((error) =>
        this.actions.requestFacetsFail({ params, error })
      );

    return params;
  }

  requestFacetsSuccess(results) {
    return results;
  }

  requestFacetsFail(error) {
    return error;
  }
}

export default SearchActions;
