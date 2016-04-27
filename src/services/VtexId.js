import axios from 'axios';
import StorefrontConstants from 'constants/StorefrontConstants';
import dispatcher from '../dispatcher/StorefrontDispatcher';

const _getStartVtexIdURL = () => {
  return StorefrontConstants.BASE_VTEXID_URL + 'start';
};

const _getEmailLoginVtexIdURL = () => {
  return StorefrontConstants.BASE_VTEXID_URL + 'classic/validate';
};

export function startLogin() {
  return axios.get(_getStartVtexIdURL(), {
    params: {
      scope: dispatcher.stores.ContextStore.getState().get('accountName')
    }
  });
}

export function validateClassicLogin(authenticationToken, login, password) {
  return axios.get(_getEmailLoginVtexIdURL(), {
    params: {
      authenticationToken: authenticationToken,
      login: login,
      password: password
    }
  });
}
