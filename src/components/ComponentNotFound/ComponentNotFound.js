import React from 'react';
import './style.less';
import { store } from '../../StorefrontSDK';
import editDistance from 'utils/editDistance';

const findSimilarRegisteredComponent = (componentId) => {
  let similar;
  let similarDistance = 4;
  let components = store.getState().component.toJS();

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

      let ComponentStatus = 'error';
      let ComponentDisplayStatus = 'Error';

      return (
          <div className="ComponentNotFound">
          <div className="ComponentNotFound-inner">
            <span className="ComponentNotFound-header">Storefront</span>
            <span className="ComponentNotFound-status" data-is-status={ComponentStatus}>{ComponentDisplayStatus}</span>
            <h1 className="ComponentNotFound-title">Component not found</h1>
            <div className="ComponentNotFound-card">
              { similar ?
                <div className="ComponentNotFound-hint">
                  <p><strong>HINT: <br/>There's a component registered as "{similar}", is it a typo?</strong></p>
                </div> : null}

              <p>The route <code>{routeName}</code> is handled by the component <code>{componentId}</code>,
              but this component is not in the ComponentStore registry.</p>
              <p>If you did register, make sure you called <code>actions.Component<wbr/>Actions.register</code> with the right params in your Javascript code.</p>
              <p><a className="ComponentNotFound-docs-link" href="http://vtex-apps.github.io/storefront-sdk/pt/basico/registro.html">Read the docs on how to register components</a></p>
            </div>
          </div>
        </div>
      );
    }
  };
}
