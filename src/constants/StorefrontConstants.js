export default {
  BASE_URL: 'http://api.beta.vtex.com/',
  BASE_CHECKOUT_URL: '/api/checkout/pub/',
  BASE_VTEXID_URL: 'https://vtexid.vtex.com.br/api/vtexid/pub/authentication/',
  COOKIE_NAME: 'checkout.vtex.com',
  COOKIE_ORDER_FORM_ID_KEY: '__ofid',
  ALL_ORDERFORM_SECTIONS: [
    'items',
    'totalizers',
    'clientProfileData',
    'shippingData',
    'paymentData',
    'sellers',
    'messages',
    'marketingData',
    'clientPreferencesData',
    'storePreferencesData',
    'giftRegistryData',
    'shippingData',
    'ratesAndBenefitsData',
    'openTextField'
  ],
  SESSIONS: {
    shippingData: 'shippingData'
  },
  SEARCH_AJAX: {
    type: 'GET',
    crossDomain: true,
    dataType: 'json'
  },
  CHECKOUT_AJAX: {
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
  }
};
