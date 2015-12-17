import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';

let FormattedNumber = window.ReactIntl.FormattedNumber;

class Price extends React.Component {
  static propTypes = {
    value: React.PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      currency: dispatcher.stores.ContextStore.getState().getIn(['culture' ,'currency'])
    };
  }

  render() {
    return (
      <FormattedNumber style="currency" value={this.props.value} currency={this.state.currency} />
    );
  }
}

export default Price;
