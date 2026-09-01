import { escapeHtml, label } from "./ui.js";

export function radioGroup(name,values,current){return `<div class="choice-grid">${values.map(value=>`<div class="choice"><input type="radio" id="${name}-${value}" name="${name}" value="${value}" ${current===value?"checked":""}><label for="${name}-${value}">${label(value)}</label></div>`).join("")}</div>`;}
export function chips(name,values,current=[]){return `<div class="chip-group">${values.map(value=>`<div class="chip"><input type="checkbox" id="${name}-${value}" name="${name}" value="${value}" ${current.includes(value)?"checked":""}><label for="${name}-${value}">${label(value)}</label></div>`).join("")}</div>`;}
export function selectOptions(values,current,blank="Select one"){return `<option value="">${escapeHtml(blank)}</option>${values.map(value=>`<option value="${value}" ${current===value?"selected":""}>${label(value)}</option>`).join("")}`;}
export function formValue(form,name){return new FormData(form).get(name)?.toString()||""}
export function formValues(form,name){return new FormData(form).getAll(name).map(String)}
