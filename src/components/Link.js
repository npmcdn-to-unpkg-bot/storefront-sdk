/**
 * This is a dumbed down implementation of the Link component
 * found on the react-router package.
 *
 * Thanks for the work of all the collaborators of the react-router project!
 * Please take a look at their work, it'll probably be super useful for you :)
 */

import React from 'react';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function createLocationDescriptor(to, { query, hash, state }) {
  if (query || hash || state) {
    return { pathname: to, query, hash, state };
  }

  return to;
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 *
 * Example:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along query string parameters in the query props.
 *
 *   <Link ... query={{ show: true }} />
 */
class Link extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  static propTypes =  {
    to: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]).isRequired,
    query: React.PropTypes.object,
    hash: React.PropTypes.string,
    state: React.PropTypes.object,
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    className: '',
    style: {}
  }

  handleClick = (event) => {
    let allowTransition = true;

    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      allowTransition = false;
    }

    // If target prop is set (e.g. to "_blank") let browser handle link.
    /* istanbul ignore if: untestable with Karma */
    if (this.props.target) {
      if (!allowTransition) {
        event.preventDefault();
      }

      return;
    }

    event.preventDefault();

    if (allowTransition) {
      const { to, query, hash, state } = this.props;
      const location = createLocationDescriptor(to, { query, hash, state });

      this.context.history.push(location);
    }
  }

  render() {
    const { history } = this.context;
    const {
      to,
      query,
      hash,
      state,
      ...props
    } = this.props;

    if (history) {
      const location = createLocationDescriptor(to, { query, hash, state });
      props.href = history.createHref(location);
    }

    return (
      <a {...props} onClick={this.handleClick} />
    );
  }
}

export default Link;
