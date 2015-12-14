import { component } from '../constants';

export function register(payload) {
  return {
    type: component.REGISTER,
    payload
  };
}
