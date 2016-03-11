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
let assetsMap = {};
function getRouteAssets(dispatcher, ignoreAssetLoad) {
  const ContextStore = dispatcher.stores.ContextStore.getState();
  const route = ContextStore.get('route');
  const AssetStore = dispatcher.stores.AssetStore.getState();
  const routeAssets = AssetStore.get(route);
  const assetsPayload = routeAssets && routeAssets.get('payload');


  // If the list of assets is present
  if (assetsPayload) {
    // Auxiliar map to make the diff of the assets
    let newAssetsMap = {};
    // assets will receive the diff of the actual route scripts with the ones on the map
    let assets;
    // If there's no assets on the map, fill it with all the route assets
    if (Object.keys(assetsMap).length === 0) {
      assetsPayload.forEach(newAsset => assetsMap[newAsset] = null);
    } else {
      // Else lets make a diff
      assetsPayload.forEach(newAsset => {
        let isAssetNew;
        for (let asset in assetsMap) {
          if (newAsset === asset) {
            isAssetNew = false;
            break;
          }
          isAssetNew = true;
        }

        if (isAssetNew) newAssetsMap[newAsset] = null;
      });

      // Merge the assets maps
      assetsMap = { ...assetsMap, ...newAssetsMap };
    }

    // If we don't need to load the scripts
    if (ignoreAssetLoad) {
      setTimeout(() => {
        dispatcher.actions.AreaActions.loadPageSuccess(route);
      }, 0);

      return;
    }

    // Pass all the new assets to the var we will use to load the scripts
    assets = Object.keys(newAssetsMap).map(newAsset => newAsset);
    // Promises array
    const requests = [];
    // Load all the scripts
    assets.forEach(asset => requests.push(loadScript(asset)));

    // When all files are loaded
    Promise.all(requests).then(() => {
      dispatcher.actions.AreaActions.loadPageSuccess(route);
    });
  }
}

export default function loadPage(currentURL, dispatcher, ignoreAssetLoad = false) {
  // Listener of the context store
  const contextListener = () => {
    getRouteAssets(dispatcher, ignoreAssetLoad);
    dispatcher.stores.ContextStore.unlisten(contextListener);
  };

  // Add a store listener, every change to ContextStore will call getRouteAssets()
  dispatcher.stores.ContextStore.listen(contextListener);
  // Here we go! :)
  dispatcher.actions.AreaActions.getRouteResources(currentURL);
}

