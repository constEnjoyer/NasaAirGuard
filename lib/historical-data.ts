export interface HistoricalDataPoint {
  date: string
  aqi: number
  pm25: number
  pm10: number
  no2: number
  o3: number
  so2: number
}

export function generateHistoricalData(city: string, days = 30): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  const today = new Date("2025-10-05") // Using current date (October 5, 2025) for real-time appearance

  // Base values for different cities
  const cityBaselines: Record<string, { aqi: number; variance: number }> = {
    NYC: { aqi: 65, variance: 25 },
    LA: { aqi: 85, variance: 30 },
    CHI: { aqi: 70, variance: 20 },
    HOU: { aqi: 75, variance: 25 },
    PHX: { aqi: 80, variance: 28 },
  }

  const baseline = cityBaselines[city] || { aqi: 70, variance: 25 }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Add some realistic variation with trends
    const trend = Math.sin(i / 7) * 10 // Weekly cycle
    const random = (Math.random() - 0.5) * baseline.variance
    const aqi = Math.max(20, Math.min(180, baseline.aqi + trend + random))

    data.push({
      date: date.toISOString().split("T")[0],
      aqi: Math.round(aqi),
      pm25: Math.round(aqi * 0.4 + Math.random() * 10),
      pm10: Math.round(aqi * 0.5 + Math.random() * 15),
      no2: Math.round(aqi * 0.3 + Math.random() * 8),
      o3: Math.round(aqi * 0.35 + Math.random() * 12),
      so2: Math.round(aqi * 0.2 + Math.random() * 5),
    })
  }

  return data
}

export function generateForecastData(currentAQI: number, days = 3): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  const today = new Date("2025-10-05") // Using current date (October 5, 2025) for real-time appearance

  for (let i = 1; i <= days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Forecast with slight trend and uncertainty
    const trend = (Math.random() - 0.5) * 15
    const aqi = Math.max(20, Math.min(180, currentAQI + trend))

    data.push({
      date: date.toISOString().split("T")[0],
      aqi: Math.round(aqi),
      pm25: Math.round(aqi * 0.4),
      pm10: Math.round(aqi * 0.5),
      no2: Math.round(aqi * 0.3),
      o3: Math.round(aqi * 0.35),
      so2: Math.round(aqi * 0.2),
    })
  }

  return data
}

export type TimeRange = "7d" | "30d" | "90d"

export function getTimeRangeLabel(range: TimeRange): string {
  switch (range) {
    case "7d":
      return "Last 7 Days"
    case "30d":
      return "Last 30 Days"
    case "90d":
      return "Last 90 Days"
  }
}

export function getTimeRangeDays(range: TimeRange): number {
  switch (range) {
    case "7d":
      return 7
    case "30d":
      return 30
    case "90d":
      return 90
  }
}
