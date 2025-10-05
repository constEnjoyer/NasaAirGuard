export interface AirQualityAlert {
  id: string
  city: string
  cityName: string
  threshold: number
  currentAQI: number
  timestamp: string
  severity: "moderate" | "unhealthy" | "very-unhealthy" | "hazardous"
}

export interface AlertSettings {
  enabled: boolean
  threshold: number
  cities: string[]
}

const ALERTS_STORAGE_KEY = "airguard_alerts"
const SETTINGS_STORAGE_KEY = "airguard_alert_settings"

export function getAlertSettings(): AlertSettings {
  if (typeof window === "undefined") {
    return { enabled: false, threshold: 100, cities: [] }
  }
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : { enabled: false, threshold: 100, cities: [] }
  } catch {
    return { enabled: false, threshold: 100, cities: [] }
  }
}

export function saveAlertSettings(settings: AlertSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export function getAlerts(): AirQualityAlert[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addAlert(alert: AirQualityAlert): void {
  const alerts = getAlerts()
  alerts.unshift(alert)
  // Keep only last 50 alerts
  const trimmed = alerts.slice(0, 50)
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(trimmed))
}

export function clearAlerts(): void {
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([]))
}

export function checkAQIThreshold(cityCode: string, cityName: string, aqi: number): void {
  const settings = getAlertSettings()
  if (!settings.enabled || !settings.cities.includes(cityCode)) return
  if (aqi < settings.threshold) return

  let severity: AirQualityAlert["severity"] = "moderate"
  if (aqi > 200) severity = "very-unhealthy"
  else if (aqi > 150) severity = "unhealthy"
  else if (aqi > 300) severity = "hazardous"

  const alert: AirQualityAlert = {
    id: `${cityCode}-${Date.now()}`,
    city: cityCode,
    cityName,
    threshold: settings.threshold,
    currentAQI: aqi,
    timestamp: new Date().toISOString(),
    severity,
  }

  addAlert(alert)
}

export function getSeverityColor(severity: AirQualityAlert["severity"]): string {
  switch (severity) {
    case "moderate":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "unhealthy":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "very-unhealthy":
      return "bg-red-100 text-red-800 border-red-300"
    case "hazardous":
      return "bg-red-200 text-red-900 border-red-400"
  }
}
