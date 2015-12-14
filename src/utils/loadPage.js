import { replaceWithCache, setLoading } from '../actionCreators/context';
import { getRouteResources } from '../actionCreators/area';

// Helper function to get an absolute URL
// https://davidwalsh.name/get-absolute-url
const a = document.createElement('a');
function getAbsoluteURL(path) {
  a.href = path;
  return a.href;
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    const s = document.createElement('script');
    s.src = getAbsoluteURL(src);
    // TODO: make sync scripts work on all browsers
    s.async = false;
    s.onload = resolve;
    s.onerror = reject;
    const script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(s, script);
  });
}

// Declare an assets map to not load scripts unnecessarily
let assetsMap = window.storefront.currentRoute.assets.reduce((map, asset) => {
  map[asset] = true;
  return map;
}, {});
function getRouteAssets(currentURL, store) {
  const context = store.getState().SDK.context;
  const assets = store.getState().SDK.assets;
  const route = context.get('route');
  const routeAssets = assets.get(route);
  const assetsPayload = routeAssets && routeAssets.get('payload');

  // If the list of assets is present
  if (assetsPayload) {
    // assets will receive the diff of the actual route scripts with the ones on the map
    let assets = [];
    // If there's no assets on the map, fill it with all the route assets
    if (Object.keys(assetsMap).length === 0) {
      assetsPayload.forEach(newAsset => {
        assets.push(newAsset);
        assetsMap[newAsset] = true;
      });
    } else {
      // Else lets make a diff
      // ===========================================
      // Auxiliar map to make the diff of the assets
      let newAssetsMap = {};
      assetsPayload.forEach(newAsset => {
        let isAssetNew;
        for (let asset in assetsMap) {
          if (newAsset === asset) {
            isAssetNew = false;
            break;
          }
          isAssetNew = true;
        }

        if (isAssetNew) newAssetsMap[newAsset] = true;
      });

      // Pass all the new assets to the var we will use to load the scripts
      assets = Object.keys(newAssetsMap).map(newAsset => newAsset);
      // Merge the assets maps
      assetsMap = { ...assetsMap, ...newAssetsMap };
    }

    // Promises array
    const requests = [];
    // Load all the scripts
    assets.forEach(asset => requests.push(loadScript(asset)));

    // When all files are loaded
    Promise.all(requests).then(() => {
      URLMap[currentURL] = true;
      store.dispatch(setLoading(false));
    });
  }
}

// Declare URL map to not load pages settings unnecessarily
let URLMap = {};
function loadPage(location, store) {
  const currentURL = location.pathname + location.search;

  // If we have any URLs on the map
  // or the current URL is present
  if (Object.keys(URLMap).length > 0 && !URLMap[currentURL]) {
    let unsubscribe;

    // Listener of the context store
    const contextListener = () => {
      getRouteAssets(currentURL, store);
      unsubscribe();
    };

    // Add a store listener, every change to ContextStore will call getRouteAssets()
    unsubscribe = store.subscribe(contextListener);
    // Here we go! :)
    store.dispatch(getRouteResources(currentURL, location));
  } else if (URLMap[currentURL]) {
    // If we have the URL on the map
    // We have the cache too, so we don't need
    // to load anything
    store.dispatch(replaceWithCache(currentURL));
    store.dispatch(setLoading(false));
  } else {
    // If all else fails, then that means it's the first load
    // On the first load the page comes preload, so we just need
    // to add the current URL to the map
    URLMap[currentURL] = true;
    store.dispatch(setLoading(false));
  }
}

export { loadScript, loadPage };
