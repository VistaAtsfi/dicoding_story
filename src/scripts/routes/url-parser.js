function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  return pathname || '/';
}

export function getActivePathname() {
  //return location.hash.replace('#', '') || '/';
    return location.hash.replace('#', '').split('?')[0] || '/';
  
  // const pathname = getActivePathname();
  // const cleanPath = pathname.split('?')[0];
  // const urlSegments = extractPathnameSegments(cleanPath);
  // return constructRouteFromSegments(urlSegments);
}

export function getActiveRoute() {
  const pathname = getActivePathname();
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parseActivePathname() {
  const currentHash = window.location.hash; // Contoh: "#/story-detail?id=story-HLPujob6sKVWkxOe"

  const [hashPathPart, hashQueryStringPart] = currentHash.replace('#', '').split('?');
 
  const pathname = hashPathPart || '/'; 

  let storyId = null;
  if (hashQueryStringPart) { 
    const paramsInHash = new URLSearchParams(hashQueryStringPart);
    storyId = paramsInHash.get('id'); 
    }

  const splitPath = pathname.split('/');

  return {
    resource: splitPath[1] || null, 
    id: storyId, 
  };
}


export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}