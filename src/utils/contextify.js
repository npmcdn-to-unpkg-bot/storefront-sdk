import React from 'react';

export default function contextify() {
  return Component => {
    class ContextifiedComponent extends React.Component {
      static contextTypes = {
        parentId: React.PropTypes.string
      }

      static childContextTypes = {
        parentId: React.PropTypes.string
      }

      getChildContext() {
        return { parentId: this.state.fullId };
      }

      componentWillMount() {
        this.setState({
          fullId: this.getPlaceholderId(this.props, this.context)
        });
      }

      componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
          fullId: this.getPlaceholderId(nextProps, nextContext)
        });
      }

      getPlaceholderId = (props, context) => {
        let id = props.id;

        if (context.parentId) {
          id = context.parentId + '/' + id;
        }

        return id;
      }

      render() {
        return (
          <Component {...this.props} id={this.state.fullId} />
        );
      }
    }

    return ContextifiedComponent;
  };
}
