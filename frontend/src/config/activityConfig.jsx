export const ACTIVITY_TYPES = {
  WATER: "WATER",
  WORKOUT: "WORKOUT",
  ALCOHOL: "ALCOHOL",
  SLEEP: "SLEEP",
  DIET: "DIET",
  STEPS: "STEPS",
};

export const activityConfig = {
  WATER: {
    type: "action",
    getDisplay: (progress) => `${progress.water ?? 0} L`,
    isCompleted: () => false,
    update: (progress, value) => ({
      ...progress,
      // if value passed directly (from modal), set it. Otherwise increment by 0.5
      water: value !== undefined ? progress.water + value : (progress.water ?? 0) + 0.5,
    }),
  },

  ALCOHOL: {
    type: "action",
    getDisplay: (progress) =>
      progress.noAlcohol ? "✅ Clean" : "",
    isCompleted: (progress) => progress.noAlcohol === true,
    update: (progress) => ({ ...progress, noAlcohol: true }), // one-way, no untoggle
  },

  WORKOUT: {
    type: "page",
    route: "/workout",
    getDisplay: (progress) => (progress.workoutDone ? "Done" : ""),
    isCompleted: () => false, // always interactive
  },

  DIET: {
    type: "page",
    route: "/diet",
    getDisplay: (progress) => (progress.dietDone ? "Done" : ""),
    isCompleted: () => false, // always interactive
  },

  SLEEP: {
    type: "input",
    getDisplay: (progress) => progress.sleep ? `${progress.sleep} hrs` : "",
    isCompleted: () => false,
    update: (progress, value) => ({ ...progress, sleep: Math.round(((progress.sleep ?? 0) + Number(value)) * 10) / 10 })
},

STEPS: {
    type: "input",
    getDisplay: (progress) => progress.steps ? `${progress.steps.toLocaleString()} steps` : "",
    isCompleted: () => false,
    update: (progress, value) => ({ ...progress, steps: (progress.steps ?? 0) + Number(value) })
},
};
