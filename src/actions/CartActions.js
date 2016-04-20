import Checkout from 'services/Checkout';
import debounce from 'debounce';
import StorefrontConstants from 'constants/StorefrontConstants';

const checkout = new Checkout();

class CartActions {
  requestCart() {
    this.dispatch();

    return checkout.getOrderForm()
      .then((result) =>
        this.actions.requestSuccess(result.data)
      )
      .catch((error) =>
        this.actions.requestFail(error)
      );
  }

  updateItems(orderFormId, items, expectedOrderFormSections = undefined, waitTime = 0) {
    this.dispatch();

    return (debounce(() => {
      return checkout.updateItems(orderFormId, items, expectedOrderFormSections)
        .then((result) =>
          this.actions.requestSuccess(result.data)
        )
        .catch((error) =>
          this.actions.requestFail(error)
        );
    }, waitTime)());
  }

  removeItems(orderFormId, items, expectedOrderFormSections = undefined) {
    this.dispatch(items);

    return checkout.removeItems(orderFormId, items, expectedOrderFormSections)
      .then((updatedOrderForm) =>
        this.actions.requestSuccess(updatedOrderForm.data)
      )
      .catch((error) =>
        this.actions.requestFail(error)
      );
  }

  addToCart(orderFormId, items, expectedOrderFormSections = undefined) {
    this.dispatch();

    return checkout.addToCart(orderFormId, items, expectedOrderFormSections)
      .then((result) =>
        this.actions.requestSuccess(result.data)
      )
      .catch((error) =>
        this.actions.requestFail(error)
      );
  }

  addShippingData(orderFormId, shippingData, expectedOrderFormSections = undefined){
    this.dispatch();

    return checkout.sendAttachment(orderFormId, StorefrontConstants.SESSIONS.shippingData,
        shippingData, expectedOrderFormSections)
      .then((updatedShippingData) =>
        this.actions.requestSuccess(updatedShippingData)
      )
      .catch((error) =>
        this.actions.requestFail(error)
      );
  }

  requestSuccess(orderForm) {
    this.dispatch(orderForm);
  }

  requestFail(error) {
    this.dispatch(error);
  }
}

export default CartActions;
