import { escapeHtml } from "./ui.js";
export const fieldError=(name,message="")=>`<p class="field-error" data-error="${escapeHtml(name)}" aria-live="polite">${escapeHtml(message)}</p>`;
export const radioCards=(name,options,current="")=>`<div class="choice-grid">${options.map(([value,label,help=""])=>`<label class="choice-card"><input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${value===current?"checked":""}><span><strong>${escapeHtml(label)}</strong>${help?`<small>${escapeHtml(help)}</small>`:""}</span></label>`).join("")}</div>`;
