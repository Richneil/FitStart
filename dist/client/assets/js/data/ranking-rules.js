export const focusAreas = {
  bodyFat:{label:"Body fat",definition:"The measurements that estimate how much body fat appears in your report.",metrics:["pbf","body-fat-mass","segmental-fat","body-type","fat-control"]},
  bodyWeight:{label:"Body weight",definition:"Weight-related results, including your weight and body size estimate (BMI).",metrics:["weight","bmi","target-weight","weight-control"]},
  muscleMass:{label:"Muscle and lean mass",definition:"Estimates of the muscle and lean tissue in your body.",metrics:["smm","right-arm-lean","left-arm-lean","trunk-lean","right-leg-lean","left-leg-lean","muscle-control"]},
  bodyCompositionBalance:{label:"Body composition balance",definition:"Water, protein, minerals, and lean-tissue estimates viewed together.",metrics:["body-water","ecf","icf","protein","minerals","soft-lean-mass","fat-free-mass"]},
  centralFatIndicators:{label:"Fat distribution",definition:"Where body fat may be concentrated, based on the waist-to-hip ratio and visceral-fat estimate.",metrics:["whr","visceral-fat"]},
  metabolicInformation:{label:"Resting energy",definition:"The report’s estimate of how much energy your body uses while resting.",metrics:["bmr"]}
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
