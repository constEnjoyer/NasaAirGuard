export interface PollutantInfo {
  id: string
  name: string
  formula: string
  description: string
  sources: string[]
  healthEffects: string[]
  safeLevel: string
  color: string
}

export const POLLUTANTS_INFO: Record<string, PollutantInfo> = {
  pm25: {
    id: "pm25",
    name: "Fine Particulate Matter",
    formula: "PM2.5",
    description:
      "Tiny particles or droplets in the air that are 2.5 micrometers or less in width. These particles are so small they can penetrate deep into the lungs and even enter the bloodstream.",
    sources: [
      "Vehicle exhaust and emissions",
      "Industrial facilities and power plants",
      "Residential wood burning",
      "Wildfires and agricultural burning",
      "Construction and road dust",
    ],
    healthEffects: [
      "Respiratory irritation and reduced lung function",
      "Aggravation of asthma and chronic bronchitis",
      "Increased risk of heart attacks and strokes",
      "Premature death in people with heart or lung disease",
      "Developmental issues in children",
    ],
    safeLevel: "0-12 μg/m³ (WHO guideline)",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  pm10: {
    id: "pm10",
    name: "Coarse Particulate Matter",
    formula: "PM10",
    description:
      "Inhalable particles with diameters of 10 micrometers or less. While larger than PM2.5, these particles can still penetrate into the lungs and cause health problems.",
    sources: [
      "Dust from roads and construction sites",
      "Crushing and grinding operations",
      "Agricultural activities",
      "Windblown dust from open lands",
      "Industrial emissions",
    ],
    healthEffects: [
      "Irritation of airways and coughing",
      "Difficulty breathing and chest tightness",
      "Aggravation of asthma symptoms",
      "Reduced lung function",
      "Increased hospital admissions for respiratory issues",
    ],
    safeLevel: "0-20 μg/m³ (WHO guideline)",
    color: "bg-amber-100 text-amber-800 border-amber-300",
  },
  no2: {
    id: "no2",
    name: "Nitrogen Dioxide",
    formula: "NO₂",
    description:
      "A reddish-brown gas with a sharp, harsh odor. It forms when fossil fuels are burned at high temperatures and is a major component of urban air pollution.",
    sources: [
      "Vehicle emissions (especially diesel)",
      "Power plants and industrial facilities",
      "Gas stoves and heating appliances",
      "Cigarette smoke",
      "Welding operations",
    ],
    healthEffects: [
      "Inflammation of airways and reduced immunity",
      "Increased susceptibility to respiratory infections",
      "Worsening of asthma and bronchitis",
      "Reduced lung development in children",
      "Increased emergency room visits",
    ],
    safeLevel: "0-25 μg/m³ annual mean (WHO guideline)",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  o3: {
    id: "o3",
    name: "Ground-level Ozone",
    formula: "O₃",
    description:
      "A colorless gas formed when pollutants from cars, power plants, and other sources react with sunlight. Unlike stratospheric ozone which protects us, ground-level ozone is harmful.",
    sources: [
      "Chemical reaction of NOx and VOCs in sunlight",
      "Vehicle exhaust emissions",
      "Industrial facility emissions",
      "Gasoline vapors and chemical solvents",
      "Worse on hot, sunny days",
    ],
    healthEffects: [
      "Chest pain and throat irritation",
      "Coughing and breathing difficulty",
      "Reduced lung function and capacity",
      "Aggravation of asthma and emphysema",
      "Increased risk of premature death",
    ],
    safeLevel: "0-100 μg/m³ peak season (WHO guideline)",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  so2: {
    id: "so2",
    name: "Sulfur Dioxide",
    formula: "SO₂",
    description:
      "A colorless gas with a pungent, suffocating odor. It's produced by burning fossil fuels containing sulfur and from volcanic eruptions.",
    sources: [
      "Coal and oil combustion at power plants",
      "Metal smelting and processing",
      "Diesel engines and ships",
      "Volcanic activity",
      "Industrial processes using sulfur",
    ],
    healthEffects: [
      "Respiratory problems and difficulty breathing",
      "Aggravation of existing heart disease",
      "Increased asthma attacks",
      "Eye, nose, and throat irritation",
      "Contributes to acid rain formation",
    ],
    safeLevel: "0-40 μg/m³ 24-hour mean (WHO guideline)",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  co: {
    id: "co",
    name: "Carbon Monoxide",
    formula: "CO",
    description:
      "A colorless, odorless gas produced by incomplete combustion of carbon-containing fuels. It reduces oxygen delivery to the body's organs and tissues.",
    sources: [
      "Vehicle exhaust emissions",
      "Residential heating systems",
      "Gas stoves and appliances",
      "Cigarette smoke",
      "Industrial processes",
    ],
    healthEffects: [
      "Reduced oxygen delivery to organs",
      "Chest pain in people with heart disease",
      "Headaches and dizziness",
      "Confusion and impaired vision",
      "Fatal at very high concentrations",
    ],
    safeLevel: "0-4 mg/m³ 24-hour mean (WHO guideline)",
    color: "bg-gray-100 text-gray-800 border-gray-300",
  },
}

export interface HealthTip {
  id: string
  category: "prevention" | "indoor" | "outdoor" | "sensitive"
  title: string
  description: string
  icon: string
}

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: "check-aqi",
    category: "prevention",
    title: "Check AQI Daily",
    description:
      "Monitor air quality levels before planning outdoor activities, especially during high pollution days.",
    icon: "📊",
  },
  {
    id: "limit-outdoor",
    category: "outdoor",
    title: "Limit Outdoor Exercise",
    description:
      "Reduce intense outdoor activities when AQI is unhealthy. Exercise indoors or during times when air quality is better.",
    icon: "🏃",
  },
  {
    id: "wear-mask",
    category: "outdoor",
    title: "Wear N95 Masks",
    description: "Use properly fitted N95 or P100 respirators when AQI exceeds 150 to filter out harmful particles.",
    icon: "😷",
  },
  {
    id: "close-windows",
    category: "indoor",
    title: "Keep Windows Closed",
    description: "Close windows and doors during high pollution days to prevent outdoor air from entering your home.",
    icon: "🪟",
  },
  {
    id: "air-purifier",
    category: "indoor",
    title: "Use Air Purifiers",
    description:
      "Run HEPA air purifiers indoors to remove particles and improve indoor air quality, especially in bedrooms.",
    icon: "💨",
  },
  {
    id: "avoid-traffic",
    category: "outdoor",
    title: "Avoid High-Traffic Areas",
    description: "Stay away from busy roads and highways where vehicle emissions are concentrated.",
    icon: "🚗",
  },
  {
    id: "indoor-plants",
    category: "indoor",
    title: "Add Indoor Plants",
    description: "Certain plants like spider plants and peace lilies can help filter indoor air pollutants naturally.",
    icon: "🌿",
  },
  {
    id: "ventilation",
    category: "indoor",
    title: "Improve Ventilation",
    description: "Use exhaust fans when cooking and ensure proper ventilation to reduce indoor pollutant buildup.",
    icon: "🌬️",
  },
  {
    id: "medication-ready",
    category: "sensitive",
    title: "Keep Medication Handy",
    description:
      "If you have asthma or respiratory conditions, always have your rescue inhaler and medications accessible.",
    icon: "💊",
  },
  {
    id: "stay-hydrated",
    category: "prevention",
    title: "Stay Hydrated",
    description: "Drink plenty of water to help your body flush out toxins and maintain respiratory health.",
    icon: "💧",
  },
  {
    id: "reduce-emissions",
    category: "prevention",
    title: "Reduce Personal Emissions",
    description: "Use public transport, carpool, or bike to reduce your contribution to air pollution.",
    icon: "🚲",
  },
  {
    id: "doctor-consult",
    category: "sensitive",
    title: "Consult Your Doctor",
    description:
      "If you're in a sensitive group, work with your healthcare provider to create an air quality action plan.",
    icon: "👨‍⚕️",
  },
]

export function getTipsByCategory(category: HealthTip["category"]): HealthTip[] {
  return HEALTH_TIPS.filter((tip) => tip.category === category)
}

export function getTipsForAQI(aqi: number): HealthTip[] {
  if (aqi <= 50) {
    return HEALTH_TIPS.filter((tip) => tip.category === "prevention")
  } else if (aqi <= 100) {
    return HEALTH_TIPS.filter((tip) => tip.category === "prevention" || tip.category === "sensitive")
  } else if (aqi <= 150) {
    return HEALTH_TIPS.filter((tip) => tip.category !== "indoor")
  } else {
    return HEALTH_TIPS
  }
}
