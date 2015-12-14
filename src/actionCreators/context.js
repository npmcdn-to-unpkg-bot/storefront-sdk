import { context } from '../constants';

export function changeLocation(location) {
  return {
    type: context.CHANGE_LOCATION,
    payload: {
      location
    }
  };
}

export function setLoading(bool) {
  return {
    type: context.SET_LOADING,
    payload: {
      loading: bool
    }
  };
}

export function replaceWithCache(url) {
  return {
    type: context.REPLACE_WITH_CACHE,
    payload: {
      url
    }
  };
}
