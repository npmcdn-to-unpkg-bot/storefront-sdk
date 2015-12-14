import area from './area';
import category from './category';
import component from './component';
import context from './context';
import facets from './facets';
import product from './product';
import search from './search';
import settings from './settings';

export default function reducers(state = {}, action) {
  return {
    area: area(state.area, action),
    category: category(state.category, action),
    component: component(state.component, action),
    context: context(state.context, action),
    facets: facets(state.facets, action),
    product: product(state.product, action),
    search: search(state.search, action),
    settings: settings(state.settings, action)
  };
}
