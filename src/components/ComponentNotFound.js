import React from 'react';
import dispatcher from '../dispatcher/StorefrontDispatcher';
import editDistance from '../utils/editDistance';

const findSimilarRegisteredComponent = (componentId) => {
  let similar;
  let similarDistance = 4;
  let components = dispatcher.stores.ComponentStore.getState().toJS();

  for (let component in components) {
    let distance = editDistance(component, componentId);
    if (distance < similarDistance) {
      similar = component;
    }
  }

  return similar;
};

export default function ComponentNotFound(routeName, componentId) {
  return class ComponentNotFound extends React.Component {
    render() {
      const similar = findSimilarRegisteredComponent(componentId);

      return (
        <div style={{margin: 10}}>
          <h1>Component not found.</h1>
          <p>The route "{routeName}" is handled by the component "{componentId}".&nbsp;
          But there's no "{componentId}" in the ComponentStore registry.</p>
          <p><a href="http://vtex-apps.github.io/storefront-sdk/pt/basico/registro.html">Read the docs on how to register components</a></p>
          <br/>
          <p>If you did register, make sure you called <code>actions.ComponentActions.register</code> with the right params in your Javascript code.</p>
          { similar ?
            <p><strong>There's a component registered as "{similar}", is it a typo?</strong></p> : null}
        </div>
      );
    }
  };
}
