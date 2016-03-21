import axios from 'axios';
import { defaultHeaders } from '../services/Storefront';

class RouteActions {
  getRoutes() {
    const config = {
      headers: {
        'x-vtex-workspace': defaultHeaders['x-vtex-workspace']
      }
    };

    return axios.get('/_resources/_routes', config)
      .then((response) => this.actions.getRoutesSuccess(response.data))
      .catch((error) => this.actions.getRoutesFail(error));
  }

  getRoutesSuccess(data) {
    return data;
  }

  getRoutesFail(error) {
    return error;
  }
}

export default RouteActions;