import { escapeHtml } from "./ui.js";
export const metricRow = metric => `<div class="metric-line"><div><strong>${escapeHtml(metric.name)}</strong><small>${escapeHtml(metric.range)}</small></div><span>${escapeHtml(metric.value)} ${escapeHtml(metric.unit)}</span><span class="status status-${String(metric.status).toLowerCase().replaceAll(" ","-")}">${escapeHtml(metric.status)}</span></div>`;
