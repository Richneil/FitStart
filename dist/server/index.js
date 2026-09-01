const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    let response = await env.ASSETS.fetch(assetRequest(request, requestedPath));

    if (response.status === 404 && request.headers.get("accept")?.includes("text/html")) {
      response = await env.ASSETS.fetch(assetRequest(request, "/index.html"));
    }

    return response;
  }
};
