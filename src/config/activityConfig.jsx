export const ACTIVITY_TYPES = {
    WATER: "WATER",
    WORKOUT: "WORKOUT",
    ALCOHOL: "ALCOHOL",
    SLEEP: "SLEEP",
    DIET: "DIET",
    STEPS: "STEPS"
  };

export const activityConfig = {
    WATER: {
        type: "action",
        getDisplay: (progress) => `${progress.WATER} L`,
        update: (setState) => 
            setState(progress => ({
                ...progress,
                water: progress.WATER + 0.5
            }))
    },

    ALCHOL: {
        type: "action",
        getDisplay: (progress) => progress.alcoholFree ? "✔ Done" : "Not done",
        update: (setState) => 
            setState(progress => ({
            ...progress,
            noAlchol: !progress.noAlchol
        }))
    },

    WORKOUT: {
        type: "page",
        route: "/workout"
    },

    DIET: {
        type: "page",
        route: "/diet"
    },

    SLEEP: {
        type: "input",
        getDisplay: (progress) => `${progress.sleep} hrs`,
        update: (progress, value) => ({
            ...progress,
            sleep: value
        })
    }
}