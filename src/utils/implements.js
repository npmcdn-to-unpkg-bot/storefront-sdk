import keys from 'lodash-compat/object/keys';

function isComponentImplements(placeholderId, parentId, componentImplements, components, currentRoute) {
  if (!componentImplements) {
    return false;
  }

  var parentDescriptor = getParentDescriptor(parentId, components, currentRoute);
  if (!parentDescriptor) {
    return false;
  }

  var implementedPlaceceholders = getImplementedFromParent(parentDescriptor.name, componentImplements);
  return implementedPlaceceholders.indexOf(placeholderId) > -1 ;
}

function getImplementedFromParent(parentInstanceName, componentImplements) {

  var implementedPlaceceholders = [];
  for (var i = 0; i < componentImplements.length; i++) {

    var locator = componentImplements[i];
    var splitedLocator = locator.split('#');
    var parentName = splitedLocator[0];
    var placeholder = splitedLocator[1];

    if (parentName == parentInstanceName) {
      implementedPlaceceholders.push(placeholder);
    }
  }

  return implementedPlaceceholders;
}

function getRouteInstances(instances, currentRoute) {
  for (var instance of instances) {
    if (instance.route === currentRoute) {
      return instance.ids;
    }
  }
  return [];
}

function getParentDescriptor (parentId, components, currentRoute) {
  /*let components = {
    'HomePage@vtex.storefront-theme': {
      'instances': ['home/content/body'],
      'placeholders': ['shelf', 'banner']
    }
  };
  */
  for (var componentName of keys(components)) {
    let componentDescriptor = components[componentName];
    let routeInstaces = getRouteInstances(componentDescriptor.instances, currentRoute);

    if (routeInstaces.indexOf(parentId) > -1) {
      return { name: componentName, descriptor: componentDescriptor };
    }
  }

  return null;
}

function getImplements(components, selectedComponent) {
  for (var component of keys(components)) {
    if (selectedComponent === component) {
      return components[component].implements;
    }
  }
  return [];
}

export default function isImplementsEqual(components, placeholderId, selectedComponent, parentId, currentRoute) {
  var componentImplements = getImplements(components, selectedComponent);
  return isComponentImplements(placeholderId, parentId, componentImplements, components, currentRoute);
}