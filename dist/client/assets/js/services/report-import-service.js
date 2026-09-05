export const MAX_REPORT_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_REPORT_TYPES = ["image/png", "image/jpeg", "application/pdf"];
export const ACCEPTED_REPORT_LABEL = "PNG, JPG/JPEG, or PDF up to 8 MB";

export function validateReportFile(file) {
  if (!file) return {ok:false,message:"Choose a FitMao report to continue."};
  if (!ACCEPTED_REPORT_TYPES.includes(file.type)) return {ok:false,message:`That file type is not supported. Choose ${ACCEPTED_REPORT_LABEL}.`};
  if (file.size > MAX_REPORT_BYTES) return {ok:false,message:"That file is larger than 8 MB. Choose a smaller report file."};
  return {ok:true};
}

export function createImportDraft(sourceType, fileName="") {
  return {
    sourceType,
    fileName,
    extractionStatus: sourceType === "qr-scan" ? "camera-ready" : "queued",
    extractionMode: "simulated-prototype",
    prototypeSimulation: true,
    demographics: {},
    metrics: [],
    missingMetricIds: [],
    editedMetricIds: [],
    warnings: [],
    memberVerified: false,
    errorType: null,
    errorMessage: ""
  };
}
