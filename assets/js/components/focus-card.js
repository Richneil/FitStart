import { escapeHtml } from "./ui.js";
export const focusCard = (focus,rank=1) => `<article class="card focus-card"><span class="rank">${rank}</span><div><p class="eyebrow">${rank===1?"Start here":"Review next"}</p><h3>${escapeHtml(focus.label)}</h3><p>${escapeHtml(focus.definition)}</p></div><a class="button button-secondary" href="#/results/focus/${focus.id}">Explain this</a></article>`;
