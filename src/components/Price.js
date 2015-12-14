import React from 'react';
const FormattedNumber = window.ReactIntl.FormattedNumber;

class Price extends React.Component {
  render() {
    const currency = this.context.store.getState().SDK.context.getIn(['culture' ,'currency']);

    return (
      <FormattedNumber style="currency" value={this.props.value} currency={currency} />
    );
  }
}

Price.propTypes = {
  value: React.PropTypes.number.isRequired
};

Price.contextTypes = {
  store: React.PropTypes.object
};

export default Price;
