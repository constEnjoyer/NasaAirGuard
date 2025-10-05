export interface AQICategory {
  level: string
  color: string
  bgColor: string
  range: [number, number]
  healthImplications: string
  cautionaryStatement: string
}

export const AQI_CATEGORIES: AQICategory[] = [
  {
    level: "Good",
    color: "#22c55e",
    bgColor: "#dcfce7",
    range: [0, 50],
    healthImplications: "Air quality is satisfactory, and air pollution poses little or no risk.",
    cautionaryStatement: "None",
  },
  {
    level: "Moderate",
    color: "#eab308",
    bgColor: "#fef9c3",
    range: [51, 100],
    healthImplications:
      "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
    cautionaryStatement: "Unusually sensitive people should consider limiting prolonged outdoor exertion.",
  },
  {
    level: "Unhealthy for Sensitive Groups",
    color: "#f97316",
    bgColor: "#fed7aa",
    range: [101, 150],
    healthImplications:
      "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    cautionaryStatement:
      "Children, elderly, and people with respiratory or heart conditions should limit prolonged outdoor exertion.",
  },
  {
    level: "Unhealthy",
    color: "#ef4444",
    bgColor: "#fecaca",
    range: [151, 200],
    healthImplications:
      "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    cautionaryStatement:
      "Everyone should limit prolonged outdoor exertion. Sensitive groups should avoid outdoor activities.",
  },
  {
    level: "Very Unhealthy",
    color: "#a855f7",
    bgColor: "#e9d5ff",
    range: [201, 300],
    healthImplications: "Health alert: The risk of health effects is increased for everyone.",
    cautionaryStatement: "Everyone should avoid prolonged outdoor exertion. Sensitive groups should remain indoors.",
  },
  {
    level: "Hazardous",
    color: "#7f1d1d",
    bgColor: "#fca5a5",
    range: [301, 500],
    healthImplications: "Health warning of emergency conditions: everyone is more likely to be affected.",
    cautionaryStatement: "Everyone should avoid all outdoor exertion. Stay indoors with windows closed.",
  },
]

export function getAQICategory(aqi: number): AQICategory {
  for (const category of AQI_CATEGORIES) {
    if (aqi >= category.range[0] && aqi <= category.range[1]) {
      return category
    }
  }
  return AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
}

export function getAQIColor(aqi: number): string {
  return getAQICategory(aqi).color
}

export interface HealthAdvisory {
  icon: string
  title: string
  content: string
  color: string
  priority: "high" | "medium" | "low"
}

export function getHealthAdvisories(aqi: number): HealthAdvisory[] {
  const category = getAQICategory(aqi)

  if (aqi <= 50) {
    return [
      {
        icon: "check",
        title: "Safe for Everyone",
        content: "Air quality is excellent. Perfect day for outdoor activities and exercise.",
        color: "#22c55e",
        priority: "low",
      },
    ]
  }

  if (aqi <= 100) {
    return [
      {
        icon: "info",
        title: "Generally Safe",
        content:
          "Air quality is acceptable for most people. Unusually sensitive individuals should watch for symptoms.",
        color: "#eab308",
        priority: "low",
      },
      {
        icon: "users",
        title: "Sensitive Groups",
        content:
          "People with asthma or respiratory conditions should monitor their symptoms and have medication ready.",
        color: "#eab308",
        priority: "medium",
      },
    ]
  }

  if (aqi <= 150) {
    return [
      {
        icon: "alert",
        title: "Sensitive Groups Alert",
        content:
          "Children, elderly, and people with asthma or heart disease should limit prolonged outdoor activities.",
        color: "#f97316",
        priority: "high",
      },
      {
        icon: "heart",
        title: "Asthma & Respiratory",
        content:
          "Keep rescue inhalers accessible. Consider using air purifiers indoors. Close windows during peak pollution hours.",
        color: "#f97316",
        priority: "high",
      },
      {
        icon: "activity",
        title: "Exercise Caution",
        content: "Reduce intensity of outdoor exercise. Consider moving workouts indoors or to early morning hours.",
        color: "#f97316",
        priority: "medium",
      },
    ]
  }

  if (aqi <= 200) {
    return [
      {
        icon: "alert-triangle",
        title: "Health Alert",
        content:
          "Everyone should limit prolonged outdoor exertion. Sensitive groups should avoid outdoor activities entirely.",
        color: "#ef4444",
        priority: "high",
      },
      {
        icon: "heart",
        title: "Asthma & Heart Conditions",
        content:
          "Stay indoors with windows closed. Use air purifiers with HEPA filters. Have medications readily available. Seek medical attention if symptoms worsen.",
        color: "#ef4444",
        priority: "high",
      },
      {
        icon: "users",
        title: "Children & Elderly",
        content:
          "Keep children and elderly indoors. Cancel outdoor activities and sports. Monitor for coughing, difficulty breathing, or eye irritation.",
        color: "#ef4444",
        priority: "high",
      },
      {
        icon: "home",
        title: "Indoor Air Quality",
        content:
          "Keep all windows and doors closed. Run air conditioning with clean filters. Avoid using candles, fireplaces, or other indoor pollution sources.",
        color: "#ef4444",
        priority: "medium",
      },
    ]
  }

  // Very Unhealthy or Hazardous
  return [
    {
      icon: "alert-octagon",
      title: "EMERGENCY: Stay Indoors",
      content:
        "Health emergency conditions. Everyone should avoid all outdoor activities. Stay indoors with windows and doors sealed.",
      color: "#7f1d1d",
      priority: "high",
    },
    {
      icon: "heart",
      title: "Medical Alert",
      content:
        "People with respiratory or heart conditions should remain indoors and minimize physical activity. Have emergency medications ready. Contact healthcare provider if experiencing symptoms.",
      color: "#7f1d1d",
      priority: "high",
    },
    {
      icon: "users",
      title: "Protect Vulnerable Groups",
      content:
        "Children, elderly, pregnant women, and those with chronic conditions must stay indoors. Create a clean air room with air purifiers running continuously.",
      color: "#7f1d1d",
      priority: "high",
    },
    {
      icon: "home",
      title: "Seal Your Home",
      content:
        "Close all windows and doors. Seal gaps with towels. Run HVAC with clean filters on recirculate mode. Use multiple air purifiers if available.",
      color: "#7f1d1d",
      priority: "high",
    },
    {
      icon: "shield",
      title: "If You Must Go Outside",
      content:
        "Wear N95 or P100 respirator masks (not cloth or surgical masks). Limit time outdoors to absolute minimum. Avoid any physical exertion.",
      color: "#7f1d1d",
      priority: "high",
    },
  ]
}

export function getSensitivePopulationAlerts(aqi: number): string[] {
  if (aqi <= 50) return []

  if (aqi <= 100) {
    return ["People with asthma should monitor symptoms"]
  }

  if (aqi <= 150) {
    return [
      "Children should limit outdoor play",
      "Elderly should reduce outdoor activities",
      "Asthmatics should carry inhalers",
      "Outdoor workers should take frequent breaks",
    ]
  }

  if (aqi <= 200) {
    return [
      "Children should stay indoors",
      "Elderly should avoid going outside",
      "Asthmatics should stay indoors with medication ready",
      "Outdoor workers should wear protective masks",
      "Pregnant women should limit outdoor exposure",
    ]
  }

  return [
    "All children must remain indoors",
    "Elderly must not go outside",
    "Asthmatics should have emergency plan ready",
    "All outdoor work should be suspended",
    "Pregnant women must stay indoors",
    "Anyone with heart conditions should minimize activity",
  ]
}
