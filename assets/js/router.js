const patterns = [
  ["welcome",/^#\/welcome$/],["profile-setup",/^#\/profile\/setup$/],["dashboard",/^#\/dashboard$/],
  ["assessment-import",/^#\/assessment\/import$/],["assessment-review",/^#\/assessment\/review$/],
  ["survey",/^#\/survey(?:\/(\d+))?$/],["confirm",/^#\/confirm$/],["processing",/^#\/processing$/],
  ["results",/^#\/results$/],["result-metric",/^#\/results\/metric\/([^/]+)$/],["compare",/^#\/compare$/],
  ["learn",/^#\/learn$/],["learn-metric",/^#\/learn\/([^/]+)$/],["profile",/^#\/profile$/],
  ["research",/^#\/research-comparison$/]
];

export function matchRoute(hash=location.hash) {
  for (const [name,pattern] of patterns) { const match=hash.match(pattern); if(match) return {name,params:match.slice(1)}; }
  return {name:"not-found",params:[]};
}

export function go(hash) { if(location.hash===hash) window.dispatchEvent(new HashChangeEvent("hashchange")); else location.hash=hash; }
export function startRouter(render) { window.addEventListener("hashchange",render); if(!location.hash) location.hash="#/welcome"; else render(); }
