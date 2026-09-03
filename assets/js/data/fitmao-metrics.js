export const metricSections = [
  "Body Composition Analysis",
  "Muscle-Fat Analysis",
  "Obesity Analysis",
  "Segmental Assessment",
  "Comprehensive Evaluation",
  "Body Type and Weight Control"
];

export const metricDefinitions = [
  {id:"body-water",name:"Total body water",reportName:"Body Water",abbr:"TBW",unit:"L",section:"Body Composition Analysis",range:"39.1–47.8",definition:"An estimate of the total water in your body.",reports:"FitMao reports the estimate in liters.",limitation:"Meals, exercise, hydration, and time of day can affect this estimate.",category:"Body composition"},
  {id:"protein",name:"Protein in lean tissue",reportName:"Protein",abbr:"—",unit:"kg",section:"Body Composition Analysis",range:"9.0–11.0",definition:"An estimate of protein contained in lean body tissues.",reports:"FitMao reports an estimated amount in kilograms.",limitation:"This is a device estimate and is not a dietary protein recommendation.",category:"Body composition"},
  {id:"minerals",name:"Body minerals",reportName:"Minerals",abbr:"—",unit:"kg",section:"Body Composition Analysis",range:"3.1–3.8",definition:"An estimate of mineral content in the body.",reports:"FitMao reports an estimated amount in kilograms.",limitation:"It does not diagnose bone or mineral conditions.",category:"Body composition"},
  {id:"body-fat-mass",name:"Body fat amount",reportName:"Body Fat Mass",abbr:"BFM",unit:"kg",section:"Body Composition Analysis",range:"7.1–14.3",definition:"An estimate of the total amount of body fat.",reports:"FitMao reports the estimate in kilograms.",limitation:"Measurement conditions can change the estimate.",category:"Body fat"},
  {id:"weight",name:"Weight",abbr:"—",unit:"kg",section:"Muscle-Fat Analysis",range:"50.4–68.1",definition:"How much your whole body weighed during the assessment.",reports:"FitMao reports weight in kilograms.",limitation:"Weight alone does not show how much is fat, muscle, water, or bone.",category:"Body weight"},
  {id:"smm",name:"Muscle mass",reportName:"Skeletal Muscle Mass",abbr:"SMM",unit:"kg",section:"Muscle-Fat Analysis",range:"Normal chart band",definition:"An estimate of the muscles that help your body move.",reports:"FitMao reports the estimate in kilograms and places it on a chart band.",limitation:"It is a device estimate, not a direct measurement of strength.",category:"Muscle"},
  {id:"bmi",name:"Body size estimate (BMI)",reportName:"Body Mass Index",abbr:"BMI",unit:"kg/m²",section:"Obesity Analysis",range:"Chart band",definition:"A broad number calculated from height and weight.",reports:"FitMao places BMI on a chart band.",limitation:"BMI does not directly measure body fat or distinguish fat from muscle.",category:"Body weight"},
  {id:"pbf",name:"Body fat percentage",reportName:"Percent Body Fat",abbr:"PBF",unit:"%",section:"Obesity Analysis",range:"Chart band",definition:"An estimate of how much of your body weight is fat.",reports:"FitMao reports a percentage and an Under, Normal, or Over position.",limitation:"It is an estimate and is not a diagnosis.",category:"Body fat"},
  {id:"right-arm-lean",name:"Lean mass in right arm",reportName:"Right Arm Lean",abbr:"—",unit:"kg",section:"Segmental Assessment",range:"Chart band",definition:"Estimated lean mass in the right arm.",reports:"FitMao reports a value and original chart position.",limitation:"Small differences can be affected by measurement conditions.",category:"Body areas"},
  {id:"left-arm-lean",name:"Lean mass in left arm",reportName:"Left Arm Lean",abbr:"—",unit:"kg",section:"Segmental Assessment",range:"Chart band",definition:"Estimated lean mass in the left arm.",reports:"FitMao reports a value and original chart position.",limitation:"Small differences can be affected by measurement conditions.",category:"Body areas"},
  {id:"trunk-lean",name:"Lean mass in torso",reportName:"Trunk Lean",abbr:"—",unit:"kg",section:"Segmental Assessment",range:"Chart band",definition:"Estimated lean mass in the torso.",reports:"FitMao reports a value and original chart position.",limitation:"This does not directly measure core strength.",category:"Body areas"},
  {id:"right-leg-lean",name:"Lean mass in right leg",reportName:"Right Leg Lean",abbr:"—",unit:"kg",section:"Segmental Assessment",range:"Chart band",definition:"Estimated lean mass in the right leg.",reports:"FitMao reports a value and original chart position.",limitation:"Small differences can be affected by measurement conditions.",category:"Body areas"},
  {id:"left-leg-lean",name:"Lean mass in left leg",reportName:"Left Leg Lean",abbr:"—",unit:"kg",section:"Segmental Assessment",range:"Chart band",definition:"Estimated lean mass in the left leg.",reports:"FitMao reports a value and original chart position.",limitation:"Small differences can be affected by measurement conditions.",category:"Body areas"},
  {id:"segmental-fat",name:"Body fat across different areas",reportName:"Segmental Fat Areas",abbr:"—",unit:"—",section:"Segmental Assessment",range:"Chart band",definition:"A summary of how the report labels fat estimates across body areas.",reports:"FitMao shows the original position for each area.",limitation:"It is supporting information and not a separate diagnosis.",category:"Body areas"},
  {id:"ecf",name:"Water outside cells",reportName:"Extracellular Fluid",abbr:"ECF",unit:"L",section:"Comprehensive Evaluation",range:"12.7–15.6",definition:"An estimate of body water outside the cells.",reports:"FitMao reports the estimate in liters.",limitation:"Interpret it with other body-water measurements.",category:"Body composition"},
  {id:"icf",name:"Water inside cells",reportName:"Intracellular Fluid",abbr:"ICF",unit:"L",section:"Comprehensive Evaluation",range:"20.8–25.5",definition:"An estimate of body water inside the cells.",reports:"FitMao reports the estimate in liters.",limitation:"Interpret it with other body-water measurements.",category:"Body composition"},
  {id:"soft-lean-mass",name:"Lean soft tissue",reportName:"Soft Lean Mass",abbr:"SLM",unit:"kg",section:"Comprehensive Evaluation",range:"43.2–52.8",definition:"An estimate of non-fat soft tissue in the body.",reports:"FitMao reports the estimate in kilograms.",limitation:"It is a device estimate and should be viewed with related measurements.",category:"Body composition"},
  {id:"fat-free-mass",name:"Body mass without fat",reportName:"Fat-Free Mass",abbr:"FFM",unit:"kg",section:"Comprehensive Evaluation",range:"45.8–56.0",definition:"An estimate of everything in the body except fat.",reports:"FitMao reports the estimate in kilograms.",limitation:"It combines several types of tissue and does not measure fitness by itself.",category:"Body composition"},
  {id:"bmr",name:"Resting energy estimate",reportName:"Basal Metabolic Rate",abbr:"BMR",unit:"kcal",section:"Comprehensive Evaluation",range:"No printed range",definition:"An estimate of energy your body uses at rest in one day.",reports:"FitMao reports an estimated calorie amount.",limitation:"It is not a personal calorie target or meal plan.",category:"Metabolic"},
  {id:"bone-mineral",name:"Minerals in bone",reportName:"Bone Mineral Content",abbr:"BMC",unit:"kg",section:"Comprehensive Evaluation",range:"No printed range",definition:"An estimate of minerals contained in bone.",reports:"FitMao reports an estimated amount in kilograms.",limitation:"It is not a bone-density test or diagnosis.",category:"Body composition"},
  {id:"whr",name:"Waist-to-hip comparison",reportName:"Waist-Hip Ratio",abbr:"WHR",unit:"—",section:"Comprehensive Evaluation",range:"0.80–0.90",definition:"A comparison of waist size with hip size.",reports:"FitMao reports a ratio and a printed reference range.",limitation:"This report value should not be used by itself to predict health risk.",category:"Body shape"},
  {id:"visceral-fat",name:"Fat around internal organs",reportName:"Visceral Fat Level",abbr:"VFL",unit:"level",section:"Comprehensive Evaluation",range:"1.0–9.0",definition:"A device estimate related to fat around internal organs.",reports:"FitMao reports a level and printed reference range.",limitation:"It does not predict disease risk and is not a medical diagnosis.",category:"Body fat"},
  {id:"fitmao-score",name:"FitMao Score",abbr:"—",unit:"points",section:"Comprehensive Evaluation",range:"Report output",definition:"An overall score produced by the FitMao report.",reports:"FITSTART preserves this as a source-report output.",limitation:"FITSTART does not reinterpret this score as a medical or fitness grade.",category:"Report output"},
  {id:"physiological-age",name:"Body age estimate",reportName:"Physiological Age",abbr:"—",unit:"years",section:"Comprehensive Evaluation",range:"Report output",definition:"An age-style estimate shown by the FitMao report.",reports:"FITSTART preserves the original report output.",limitation:"It is not your actual age and is not a diagnosis.",category:"Report output"},
  {id:"body-type",name:"Body type label",reportName:"Body Type",abbr:"—",unit:"—",section:"Body Type and Weight Control",range:"Original report label",definition:"A category printed by the FitMao report from its body-composition outputs.",reports:"FITSTART preserves the exact original label.",limitation:"It is a report category, not a personal identity or diagnosis.",category:"Report output"},
  {id:"target-weight",name:"Report target weight",reportName:"Target Weight",abbr:"—",unit:"kg",section:"Body Type and Weight Control",range:"Report output",definition:"A target value produced by the FitMao report.",reports:"FITSTART preserves it as original report information.",limitation:"FITSTART does not turn this value into a personal prescription.",category:"Body weight"},
  {id:"weight-control",name:"Suggested weight change",reportName:"Weight Control",abbr:"—",unit:"kg",section:"Body Type and Weight Control",range:"Report output",definition:"A weight-change value printed by the FitMao report.",reports:"FITSTART preserves the original positive or negative value.",limitation:"It is not an instruction from FITSTART.",category:"Body weight"},
  {id:"fat-control",name:"Suggested fat change",reportName:"Fat Control",abbr:"—",unit:"kg",section:"Body Type and Weight Control",range:"Report output",definition:"A fat-change value printed by the FitMao report.",reports:"FITSTART preserves the original positive or negative value.",limitation:"It is not a diet or exercise instruction from FITSTART.",category:"Body fat"},
  {id:"muscle-control",name:"Suggested muscle change",reportName:"Muscle Control",abbr:"—",unit:"kg",section:"Body Type and Weight Control",range:"Report output",definition:"A muscle-change value printed by the FitMao report.",reports:"FITSTART preserves the original positive or negative value.",limitation:"It is not an exercise prescription from FITSTART.",category:"Muscle"}
];

export const metricById = id => metricDefinitions.find(metric => metric.id === id);

const values = {
  "weight":[69.6,"Over"],"smm":[29.7,"Normal"],"body-fat-mass":[16.5,"Over"],"bmi":[25.5,"Over"],"pbf":[23.7,"Over"],
  "body-water":[38.8,"Under"],"ecf":[14.4,"Normal"],"icf":[24.3,"Normal"],"protein":[10.5,"Normal"],"minerals":[3.7,"Normal"],
  "soft-lean-mass":[49.9,"Normal"],"fat-free-mass":[53,"Normal"],"bmr":[1516,"Not provided"],"bone-mineral":[3.1,"Not provided"],
  "whr":[0.84,"Normal"],"visceral-fat":[6.6,"Normal"],"fitmao-score":[75,"Report output"],"physiological-age":[22,"Report output"],
  "body-type":["Overweight/OverFat","Original label"],"target-weight":[62.5,"Report output"],"weight-control":[-7.1,"Report output"],
  "fat-control":[-7.1,"Report output"],"muscle-control":[0,"Report output"],"right-arm-lean":[2.6,"Normal"],"left-arm-lean":[2.7,"Normal"],
  "trunk-lean":[22.3,"Normal"],"right-leg-lean":[7.5,"Normal"],"left-leg-lean":[7.6,"Normal"],"segmental-fat":["All areas","Over"]
};

export function createSampleAssessment(id="assessment-sample-current", date="2026-09-01", previous=false) {
  return {
    id, assessedAt:date, sourceType:"sample", verified:true,
    notice:"Sample values for interface testing; these are not personal assessment results",
    metrics:metricDefinitions.map(def => {
      const [base,status] = values[def.id] || ["","Not provided"];
      let value = base;
      if(previous && typeof base === "number") {
        const changes={weight:0.8,pbf:0.8,"body-fat-mass":0.6,smm:-0.2,bmi:0.3,"body-water":-0.5,"visceral-fat":0.4};
        value = Number((base + (changes[def.id] || 0)).toFixed(1));
      }
      return {...def,value,status,available:true};
    })
  };
}

export const sampleAssessments = [
  createSampleAssessment("assessment-sample-previous","2026-07-20",true),
  createSampleAssessment("assessment-sample-current","2026-09-01",false)
];
