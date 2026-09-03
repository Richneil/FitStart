const routes=[
  ["welcome",/^#\/welcome$/],["auth",/^#\/sign-in$/],["profile-setup",/^#\/profile\/setup$/],["dashboard",/^#\/dashboard$/],
  ["assessment-add",/^#\/assessment\/add$/],["assessment-manual",/^#\/assessment\/manual$/],["assessment-review",/^#\/assessment\/review$/],
  ["context-confirm",/^#\/context\/confirm$/],["processing",/^#\/processing$/],["results",/^#\/results$/],["history",/^#\/history\/([^/]+)$/],
  ["focus-detail",/^#\/results\/focus\/([^/]+)$/],["summary",/^#\/summary$/],["report",/^#\/report$/],["compare",/^#\/compare$/],
  ["glossary",/^#\/glossary$/],["glossary-detail",/^#\/glossary\/([^/]+)$/],["profile",/^#\/profile$/],["research",/^#\/research-comparison$/]
];
export function matchRoute(hash=location.hash){for(const [name,pattern] of routes){const match=hash.match(pattern);if(match)return{name,params:match.slice(1)}}return{name:"not-found",params:[]}}
export function go(hash){if(location.hash===hash)window.dispatchEvent(new HashChangeEvent("hashchange"));else location.hash=hash}
export function startRouter(render){window.addEventListener("hashchange",render);if(!location.hash)location.hash="#/welcome";else render()}
