const routes=[
  ["welcome",/^#\/welcome$/],
  ["assessment-add",/^#\/assessment\/add$/],
  ["assessment-importing",/^#\/assessment\/importing$/],
  ["assessment-review",/^#\/assessment\/review$/],
  ["readiness",/^#\/readiness$/],
  ["personalize",/^#\/personalize$/],
  ["context-confirm",/^#\/context\/confirm$/],
  ["processing",/^#\/processing$/],
  ["results",/^#\/results$/],
  ["auth",/^#\/sign-in$/],
  ["dashboard",/^#\/dashboard$/],
  ["history",/^#\/history\/([^/]+)$/],
  ["focus-detail",/^#\/results\/focus\/([^/]+)$/],
  ["summary",/^#\/summary$/],
  ["report",/^#\/report$/],
  ["compare",/^#\/compare$/],
  ["glossary",/^#\/glossary$/],
  ["glossary-detail",/^#\/glossary\/([^/]+)$/],
  ["profile",/^#\/profile$/],
  ["research",/^#\/research-comparison$/],
  ["not-found",/^#\/not-found$/]
];
export function matchRoute(hash=location.hash){for(const [name,pattern] of routes){const match=hash.match(pattern);if(match)return{name,params:match.slice(1)}}return{name:"not-found",params:[]}}
export function go(hash){if(location.hash===hash)window.dispatchEvent(new HashChangeEvent("hashchange"));else location.hash=hash}
export function startRouter(render){window.addEventListener("hashchange",render);if(!location.hash)location.hash="#/welcome";else render()}
