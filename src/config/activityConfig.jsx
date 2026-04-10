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
      water: value !== undefined ? value : (progress.water ?? 0) + 0.5,
    }),
  },

  ALCOHOL: {
    type: "action",
    getDisplay: (progress) =>
      progress.noAlcohol ? "✅ Clean" : "Tap to confirm",
    isCompleted: (progress) => progress.noAlcohol === true,
    update: (progress) => ({ ...progress, noAlcohol: true }), // one-way, no untoggle
  },

  WORKOUT: {
    type: "page",
    route: "/workout",
    getDisplay: (progress) => (progress.workoutDone ? "Done" : "Go →"),
    isCompleted: () => false, // always interactive
  },

  DIET: {
    type: "page",
    route: "/diet",
    getDisplay: (progress) => (progress.dietDone ? "Done" : "Go →"),
    isCompleted: () => false, // always interactive
  },

  SLEEP: {
    type: "input",
    getDisplay: (progress) =>
      progress.sleep ? `${progress.sleep} hrs` : "Tap to log",
    isCompleted: (progress) => progress.sleep > 0,
    update: (progress, value) => ({ ...progress, sleep: Number(value) }),
  },

  STEPS: {
    type: "input",
    getDisplay: (progress) =>
      progress.steps ? `${progress.steps}` : "Tap to log",
    isCompleted: (progress) => progress.steps > 0,
    update: (progress, value) => ({ ...progress, steps: Number(value) }),
  },
};
