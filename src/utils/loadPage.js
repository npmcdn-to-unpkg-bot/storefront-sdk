import warning from 'warning';

// Helper function to get an absolute URL
// https://davidwalsh.name/get-absolute-url
const a = document.createElement('a');
function getAbsoluteURL(path) {
  a.href = path;
  return a.href;
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    let s = document.createElement('script');
    s.src = getAbsoluteURL(src);
    s.async = false;
    s.onload = resolve;
    s.onerror = reject;
    let script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(s, script);
  });
}

let listenersMap = {};

function getAreaAssets(rendered, dispatcher, routeName, routeComponent, callback) {
  // Get assets of the route
  let assetStoreState = dispatcher.stores.AssetStore.getState();
  let areaAssets = assetStoreState.get(routeName);

  // If the list of assets is present
  if (areaAssets && areaAssets.get('payload')) {
    // Unlisten to the changes of AssetStore
    listenersMap[routeName]();

    // Get the list of assets
    let assets = areaAssets.get('payload');

    // Promises array
    let requests = [];
    for (var i = 0; i < assets.length; i++) {
      // Load all the scripts
      requests.push(loadScript(assets[i]));
    }

    // If we already have the component rendered on the page, goodbye!
    if (rendered) return;

    // When all files are loaded
    Promise.all(requests).then(() => {
      // Get the component that handles the route
      let components = dispatcher.stores.ComponentStore.getState();
      let component = components.getIn([routeComponent, 'constructor']);

      warning(component, 'Component %s not found.', routeComponent);

      // Ops, the loaded assets didn't register any component with that name
      if (!component) {
        if (__DEV__) {
          const ComponentNotFound = require('../components/ComponentNotFound/ComponentNotFound');
          component = ComponentNotFound(routeName, routeComponent);
        } else {
          console.error(`Component ${routeComponent} not found.`);
          component = () => <h1>Page not found</h1>;
        }
      }

      // Render
      callback(null, component);
    }).catch((error) => {
      callback(error);
    });
  }
}

function loadPage(dispatcher, routeName, routeComponent, callback) {
  // Check if the component is already available
  let rendered = false;
  let componentStoreState = dispatcher.stores.ComponentStore.getState();
  let component = componentStoreState.getIn([routeComponent, 'constructor']);

  // Return component page
  if (component) {
    rendered = true;
    callback(null, component);
  }

  // Add a store listener, every change to AssetStore will call getAreaAssets()
  listenersMap[routeName] = dispatcher.stores.AssetStore.listen(() => {
    getAreaAssets(rendered, dispatcher, routeName, routeComponent, callback);
  });

  // Get assets of the route
  let assetStoreState = dispatcher.stores.AssetStore.getState();
  let areaAssets = assetStoreState.get(routeName);

  // If we don't have the assets yet, request it
  if (!areaAssets) {
    // Get page assets
    return dispatcher.actions.AreaActions.getAreaAssets({id: routeName});
  }
}

export {
  loadScript,
  loadPage
};
