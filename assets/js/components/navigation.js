import { escapeHtml, label } from "./ui.js";

const navItems=[
  ["#/dashboard","Home","⌂","dashboard"],["#/assessment/import","Add Assessment","＋","assessment-import"],
  ["#/results","My Results","◎","results"],["#/compare","Compare","↔","compare"],["#/learn","Learn","◫","learn"],["#/profile","Profile","○","profile"]
];

export function appShell(content,route,state,title="FITSTART") {
  const hasResult=Boolean(state.latestResult); const canCompare=state.assessments.length>=2;
  const links=navItems.map(([href,text,icon,key])=>{
    const disabled=(key==="results"&&!hasResult)||(key==="compare"&&!canCompare);
    return `<a class="nav-link${disabled?" is-disabled":""}" href="${disabled?"#/dashboard":href}" ${route.startsWith(key)?'aria-current="page"':""} ${disabled?'aria-disabled="true"':''}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${text}</span></a>`;
  }).join("");
  const mobile=[navItems[0],navItems[1],navItems[2],navItems[4],["#/profile","More","•••","profile"]].map(([href,text,icon,key])=>`<a class="nav-link" href="${href}" ${route.startsWith(key)?'aria-current="page"':""}><span aria-hidden="true">${icon}</span><span>${text}</span></a>`).join("");
  return `<div class="app-shell"><aside class="sidebar"><a class="brand" href="#/dashboard"><span class="brand-mark">FS</span><span>FITSTART</span></a><nav class="side-nav" aria-label="Primary">${links}</nav><div class="sidebar-footer"><p><strong>${escapeHtml(state.profile?.displayName||"Demo member")}</strong></p><p class="supporting">${label(state.profile?.primaryGoal)||"No goal saved"}</p><button class="text-link danger-link" data-action="clear-data">Clear Demo Data</button></div></aside><header class="mobile-header"><a class="brand" href="#/dashboard"><span class="brand-mark">FS</span><span class="sr-only">FITSTART</span></a><strong>${escapeHtml(title)}</strong><a class="icon-button button" href="#/profile" aria-label="Open profile">○</a></header><main class="app-main" id="main-content" tabindex="-1">${content}</main><nav class="mobile-nav" aria-label="Mobile navigation">${mobile}</nav></div>`;
}
