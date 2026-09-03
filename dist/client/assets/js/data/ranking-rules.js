export const focusAreas = {
  bodyFat:{label:"Body Fat",definition:"Body-fat estimates shown across your FitMao report.",metrics:["pbf","body-fat-mass","segmental-fat","body-type","fat-control"]},
  bodyWeight:{label:"Body Weight",definition:"Weight-related results, including weight and body mass index.",metrics:["weight","bmi","target-weight","weight-control"]},
  muscleMass:{label:"Muscle Mass",definition:"Estimates related to skeletal muscle and lean mass across body areas.",metrics:["smm","right-arm-lean","left-arm-lean","trunk-lean","right-leg-lean","left-leg-lean","muscle-control"]},
  bodyCompositionBalance:{label:"Body Composition Balance",definition:"Water, protein, minerals, and lean-mass estimates viewed together.",metrics:["body-water","ecf","icf","protein","minerals","soft-lean-mass","fat-free-mass"]},
  centralFatIndicators:{label:"Central Fat Indicators",definition:"The waist-hip ratio and visceral-fat level printed in your report.",metrics:["whr","visceral-fat"]},
  metabolicInformation:{label:"Metabolic Information",definition:"The resting energy estimate shown on your report.",metrics:["bmr"]}
};

export const goalRelevance = {
  "fat-loss":{bodyFat:3,bodyWeight:2,centralFatIndicators:1},
  "muscle-development":{muscleMass:3,bodyCompositionBalance:1,bodyWeight:1},
  "general-fitness":{bodyCompositionBalance:2,bodyWeight:1,muscleMass:1},
  "understand-results":{bodyCompositionBalance:1,bodyFat:1,bodyWeight:1,muscleMass:1}
};

export const expertReviewOrder = ["bodyFat","bodyWeight","muscleMass","bodyCompositionBalance","centralFatIndicators","metabolicInformation"];

export const largeDifference = {weight:5,pbf:5,"body-fat-mass":4,smm:4,bmi:3,"body-water":8,"visceral-fat":4,bmr:250};
export const goalDirections = {"fat-loss":{pbf:"down","body-fat-mass":"down",weight:"down",bmi:"down","visceral-fat":"down"},"muscle-development":{smm:"up"}};
export const rankingNotice = "Prototype ranking logic for research demonstration; pending fitness-professional validation.";
