import { createSampleAssessment } from "../data/fitmao-metrics.js";
import { fictionalDemoMember, demoDisclosure } from "../data/demo-data.js";

const secondReportChanges = {weight:-0.7,pbf:-0.8,"body-fat-mass":-0.7,smm:0.3,bmi:-0.3,"body-water":0.4,"visceral-fat":-0.3};

function extractedMetrics(sequence=0) {
  const sample=createSampleAssessment("extracted-draft",sequence?"2026-10-05":fictionalDemoMember.assessmentDate);
  return sample.metrics.map(metric=>{
    const change=sequence?secondReportChanges[metric.id]:undefined;
    const value=typeof change==="number"&&typeof metric.value==="number"?Number((metric.value+change).toFixed(1)):metric.value;
    return {...metric,value,captureStatus:"extracted",available:value!==""};
  });
}

export function simulateExtraction(importDraft, sequence=0) {
  const name=(importDraft.fileName||"").toLowerCase();
  if (name.includes("unreadable")) return {...importDraft,extractionStatus:"failed",errorType:"unreadable",errorMessage:"We could not read this report clearly. Try another file or enter the missing values manually."};
  const partial=name.includes("partial");
  const metrics=extractedMetrics(sequence).map(metric=>partial&&["body-water","whr","visceral-fat"].includes(metric.id)?{...metric,value:"",available:false,captureStatus:"missing"}:metric);
  const date=sequence?"2026-10-05":fictionalDemoMember.assessmentDate;
  return {
    ...importDraft,
    extractionStatus: partial?"partial":"complete",
    extractionMode:"simulated-prototype",
    prototypeSimulation:true,
    demographics:{...fictionalDemoMember,assessmentDate:date},
    metrics,
    missingMetricIds:metrics.filter(metric=>!metric.available).map(metric=>metric.id),
    warnings:partial?["Some optional fields could not be captured. Review and correct them when available."]:[],
    memberVerified:false,
    disclosure:demoDisclosure
  };
}

export function assessmentFromExtraction(extraction) {
  return {
    id:"draft",
    assessedAt:extraction.demographics.assessmentDate,
    sourceType:extraction.sourceType,
    fileName:extraction.fileName,
    verified:false,
    demographics:{...extraction.demographics},
    extractionMode:extraction.extractionMode,
    notice:extraction.disclosure,
    metrics:extraction.metrics.map(metric=>({...metric}))
  };
}
