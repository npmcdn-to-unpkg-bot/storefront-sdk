import each from 'lodash-compat/collection/each';
import StorefrontConstants from 'constants/StorefrontConstants';
import axios from 'axios';

class Checkout {
  constructor() {
    this.HOST_URL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }

  _getSaveAttachmentURL(orderFormId, attachmentId) {
    return this._getBaseOrderFormURL(orderFormId) + '/attachments/' + attachmentId;
  }

  _getBaseCheckoutURL() {
    return this.HOST_URL + StorefrontConstants.BASE_CHECKOUT_URL;
  }

  _getBaseOrderFormURL() {
    return this._getBaseCheckoutURL() + 'orderForm';
  }

  _getOrdersURL() {
    return this._getBaseCheckoutURL() + 'orders';
  }

  _getOrderFormURL(orderFormId) {
    return this._getBaseOrderFormURL() + '/' + orderFormId;
  }

  _getUpdateItemURL(orderFormId) {
    return this._getOrderFormURL(orderFormId) + '/items/update';
  }

  _getAddToCartURL(orderFormId) {
    return this._getOrderFormURL(orderFormId) + '/items';
  }

  getOrders(){
    return axios.get(this._getOrdersURL());
  }

  getOrderForm(expectedOrderFormSections = StorefrontConstants.ALL_ORDERFORM_SECTIONS) {
    const checkoutRequest = { 'expectedOrderFormSections': expectedOrderFormSections };

    return axios.get(this._getBaseOrderFormURL(), checkoutRequest);
  }

  updateItems(orderFormId, items, expectedOrderFormSections = StorefrontConstants.ALL_ORDERFORM_SECTIONS) {
    const checkoutRequest = {
      orderItems: items,
      'expectedOrderFormSections': expectedOrderFormSections
    };

    return axios.post(this._getUpdateItemURL(orderFormId), checkoutRequest);
  }

  removeItems(orderFormId, items, expectedOrderFormSections = StorefrontConstants.ALL_ORDERFORM_SECTIONS) {
    each(items, (item) => item.quantity = 0);
    return this.updateItems(orderFormId, items, expectedOrderFormSections);
  }

  sendAttachment(orderFormId, attachmentId, attachment, expectedOrderFormSections = StorefrontConstants.ALL_ORDERFORM_SECTIONS) {
    const checkoutRequest = {
      [attachmentId]: attachment,
      'expectedOrderFormSections': expectedOrderFormSections
    };

    return axios.post(this._getSaveAttachmentURL(orderFormId, attachmentId), checkoutRequest);
  }

  addToCart(orderFormId, items, expectedOrderFormSections = StorefrontConstants.ALL_ORDERFORM_SECTIONS) {
    const checkoutRequest = {
      orderItems: items,
      expectedOrderFormSections: expectedOrderFormSections
    };

    return axios.post(this._getAddToCartURL(orderFormId), checkoutRequest);
  }

}

export default Checkout;
