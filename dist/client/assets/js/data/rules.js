export const rules = {
  version: "demo-1.0",
  statusPoints: { within: 0, attention: 2, "higher-attention": 3 },
  primaryGoalPoints: 3,
  secondaryGoalPoints: 1,
  relationshipPoints: 1,
  bands: [{min:6,label:"Main Focus candidate"},{min:4,label:"Top priority"},{min:2,label:"Supporting priority"},{min:0,label:"Educational reference only"}],
  fixedOrder: ["body-fat-percentage","skeletal-muscle-mass","visceral-fat","weight","bmi","body-water","basal-metabolic-rate"],
  goalMap: {
    "fat-loss":["body-fat-percentage","visceral-fat","weight","bmi"],
    "muscle-development":["skeletal-muscle-mass","weight"],
    "general-fitness":["skeletal-muscle-mass","body-fat-percentage","body-water"],
    strength:["skeletal-muscle-mass"], endurance:["body-water","weight"],
    "learn-composition":["body-fat-percentage","skeletal-muscle-mass","visceral-fat","body-water"]
  },
  relationships: {
    "body-fat-percentage":["visceral-fat","skeletal-muscle-mass"],
    "skeletal-muscle-mass":["body-fat-percentage","body-water"],
    "visceral-fat":["body-fat-percentage"]
  },
  largeDifference: {weight:5,"body-fat-percentage":5,"skeletal-muscle-mass":4,bmi:3,"body-water":8,"visceral-fat":4,"basal-metabolic-rate":250},
  goalDirections: {"fat-loss":{"body-fat-percentage":"down","visceral-fat":"down",weight:"down",bmi:"down"},"muscle-development":{"skeletal-muscle-mass":"up"},strength:{"skeletal-muscle-mass":"up"}}
};
