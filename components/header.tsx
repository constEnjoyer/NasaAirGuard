"use client"

import { Moon, Sun, Satellite, MapPin, Layers, Bell, TrendingUp, Info, AlertCircle, Download } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"
import type { RefObject } from "react"
import { useAQIData } from "@/lib/use-aqi-data"
import TrendsChart from "./trends-chart"
import AlertsBox, { type AlertsBoxRef } from "./alerts-box"

interface HeaderProps {
  onTriggerNotification?: () => void
  selectedCity: "NYC" | "LA"
  onCityChange: (city: "NYC" | "LA") => void
  activeLayers: string[]
  onLayersChange: (layers: string[]) => void
  alertsRef: RefObject<AlertsBoxRef>
}

const cityCoordinates = {
  NYC: { name: "New York City" },
  LA: { name: "Los Angeles" },
}

const availableLayers = [
  { id: "NO2", name: "NO₂ (Nitrogen Dioxide)", color: "bg-red-500" },
  { id: "O3", name: "O₃ (Ozone)", color: "bg-purple-500" },
  { id: "HCHO", name: "HCHO (Formaldehyde)", color: "bg-orange-500" },
  { id: "AI", name: "Aerosol Index", color: "bg-yellow-500" },
  { id: "AOD", name: "Aerosol Optical Depth", color: "bg-green-500" },
]

function getAQILevel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "text-green-600" }
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-600" }
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-600" }
  if (aqi <= 200) return { label: "Unhealthy", color: "text-red-600" }
  if (aqi <= 300) return { label: "Very Unhealthy", color: "text-red-800" }
  return { label: "Hazardous", color: "text-red-900" }
}

function exportToExcel(data: any, city: string) {
  const cityName = cityCoordinates[city as "NYC" | "LA"].name
  const timestamp = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleString()

  // Using tab-separated values for better Excel compatibility
  let csv = ""

  // Header Section
  csv += `AIR QUALITY REPORT\t\t\t\t\n`
  csv += `Location:\t${cityName}\t\t\t\n`
  csv += `Export Date:\t${currentTime}\t\t\t\n`
  csv += `\n`

  // Current Air Quality - Horizontal Layout
  csv += `CURRENT AIR QUALITY\t\t\t\t\n`
  csv += `AQI\tNO₂ (μg/m³)\tO₃ (μg/m³)\tPM2.5 (μg/m³)\tPM10 (μg/m³)\n`
  csv += `${data.current.aqi}\t${data.current.pollutants.no2}\t${data.current.pollutants.o3}\t${data.current.pollutants.pm25}\t${data.current.pollutants.pm10}\n`
  csv += `\n`

  // Weather Conditions - Horizontal Layout
  csv += `WEATHER CONDITIONS\t\t\t\t\n`
  csv += `Temperature (°C)\tWind Speed (m/s)\tPrecipitation (mm)\t\t\n`
  csv += `${data.current.weather.temperature}\t${data.current.weather.wind_speed}\t${data.current.weather.precipitation}\t\t\n`
  csv += `\n`

  // 7-Day Trends - Clean Table
  csv += `7-DAY POLLUTION TRENDS\t\t\t\t\n`
  csv += `Date\tNO₂ (μg/m³)\tPM2.5 (μg/m³)\tO₃ (μg/m³)\t\n`

  const maxLength = Math.max(data.trends.no2.length, data.trends.pm25.length, data.trends.o3.length)
  for (let i = 0; i < maxLength; i++) {
    const date = data.trends.no2[i]?.date || data.trends.pm25[i]?.date || data.trends.o3[i]?.date || "-"
    const no2Value = data.trends.no2[i]?.value || "-"
    const pm25Value = data.trends.pm25[i]?.value || "-"
    const o3Value = data.trends.o3[i]?.value || "-"
    csv += `${date}\t${no2Value}\t${pm25Value}\t${o3Value}\t\n`
  }
  csv += `\n`

  // AQI Reference Scale
  csv += `AQI REFERENCE SCALE\t\t\t\t\n`
  csv += `AQI Range\tLevel\tHealth Implications\t\t\n`
  csv += `0-50\tGood\tAir quality is satisfactory\t\t\n`
  csv += `51-100\tModerate\tAcceptable for most people\t\t\n`
  csv += `101-150\tUnhealthy for Sensitive Groups\tSensitive groups may experience health effects\t\t\n`
  csv += `151-200\tUnhealthy\tEveryone may begin to experience health effects\t\t\n`
  csv += `201-300\tVery Unhealthy\tHealth alert: serious effects for everyone\t\t\n`
  csv += `301+\tHazardous\tHealth warnings of emergency conditions\t\t\n`

  // Create download with proper Excel format
  const blob = new Blob([csv], { type: "text/tab-separated-values;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `air-quality-report-${city.toLowerCase()}-${timestamp}.xls`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function Header({
  onTriggerNotification,
  selectedCity,
  onCityChange,
  activeLayers,
  onLayersChange,
  alertsRef,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { data: aqiData } = useAQIData(selectedCity)

  const toggleLayer = (layerId: string) => {
    if (activeLayers.includes(layerId)) {
      onLayersChange(activeLayers.filter((id) => id !== layerId))
    } else {
      onLayersChange([...activeLayers, layerId])
    }
  }

  const aqiLevel = aqiData ? getAQILevel(aqiData.current.aqi) : null

  const handleExport = () => {
    if (aqiData) {
      exportToExcel(aqiData, selectedCity)
    }
  }

  const handleThemeToggle = () => {
    console.log("[v0] Theme toggle clicked, current theme:", theme)
    toggleTheme()
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background/30 backdrop-blur-md border border-border/20 shadow-lg pointer-events-auto">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Satellite className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-balance">AirGuard Dashboard</h1>
            <p className="text-xs text-muted-foreground">NASA TEMPO Air Quality Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/30 backdrop-blur-md border border-border/20 hover:bg-background/40 transition-all shadow-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{cityCoordinates[selectedCity].name}</span>
            </button>

            <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl opacity-0 invisible scale-95 -translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right z-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground animate-[slideDown_0.3s_ease-out]">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">Location</h2>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value as "NYC" | "LA")}
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all animate-[slideDown_0.35s_ease-out]"
                >
                  <option value="NYC">New York City</option>
                  <option value="LA">Los Angeles</option>
                </select>

                {aqiData && (
                  <div className="bg-card rounded-lg p-4 border border-border space-y-2 animate-[slideDown_0.4s_ease-out]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current AQI</span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-4xl font-bold text-primary">{aqiData.current.aqi}</div>
                    {aqiLevel && <div className={`text-sm font-medium ${aqiLevel.color}`}>{aqiLevel.label}</div>}
                    <div className="text-xs text-muted-foreground">{cityCoordinates[selectedCity].name}</div>

                    <div className="pt-3 border-t border-border mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">NO₂:</span>
                        <span className="font-medium">{aqiData.current.pollutants.no2} мкг/м³</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">O₃:</span>
                        <span className="font-medium">{aqiData.current.pollutants.o3} мкг/м³</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">PM2.5:</span>
                        <span className="font-medium">{aqiData.current.pollutants.pm25} мкг/м³</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-3 border-t border-border animate-[slideDown_0.45s_ease-out]">
                  <h3 className="font-semibold text-sm text-foreground">AQI Scale</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span>Good (0-50)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500" />
                      <span>Moderate (51-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                      <span>Unhealthy for Sensitive (101-150)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      <span>Unhealthy (151-200)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-800" />
                      <span>Very Unhealthy (201-300)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-900" />
                      <span>Hazardous (301+)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium text-sm shadow-md hover:shadow-lg animate-[slideDown_0.5s_ease-out]"
                >
                  <Download className="w-4 h-4" />
                  Export Data (Excel)
                </button>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/30 backdrop-blur-md border border-border/20 hover:bg-background/40 transition-all shadow-lg">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Layers ({activeLayers.length})</span>
            </button>

            <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl opacity-0 invisible scale-95 -translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right z-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground animate-[slideDown_0.3s_ease-out]">
                  <Layers className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">NASA TEMPO Layers</h2>
                </div>
                <div className="space-y-2">
                  {availableLayers.map((layer, index) => (
                    <label
                      key={layer.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent cursor-pointer transition-colors animate-[slideDown_0.3s_ease-out]"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <input
                        type="checkbox"
                        checked={activeLayers.includes(layer.id)}
                        onChange={() => toggleLayer(layer.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                      <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                      <span className="text-sm font-medium flex-1">{layer.name}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-accent/50 rounded-lg p-4 border border-border space-y-2 animate-[slideDown_0.5s_ease-out]">
                  <div className="flex items-center gap-2 text-accent-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <h3 className="font-semibold text-sm">About TEMPO</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    NASA's TEMPO mission provides hourly air quality measurements across North America, tracking
                    pollutants like NO₂, O₃, and aerosols from geostationary orbit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/30 backdrop-blur-md border border-border/20 hover:bg-background/40 transition-all shadow-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Trends</span>
            </button>

            <div className="absolute top-full right-0 mt-2 w-96 p-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl opacity-0 invisible scale-95 -translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right z-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground animate-[slideDown_0.3s_ease-out]">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">7-Day Trends</h2>
                </div>
                <div className="animate-[slideDown_0.4s_ease-out]">
                  <TrendsChart selectedCity={selectedCity} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/30 backdrop-blur-md border border-border/50 hover:bg-background/40 transition-all shadow-lg">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Alerts</span>
            </button>

            <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl opacity-0 invisible scale-95 -translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right z-50">
              <div className="animate-[slideDown_0.3s_ease-out]">
                <AlertsBox ref={alertsRef} selectedCity={selectedCity} />
              </div>
            </div>
          </div>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg bg-background/30 backdrop-blur-md border border-border/20 hover:bg-background/40 transition-all shadow-lg"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {onTriggerNotification && (
            <button
              onClick={onTriggerNotification}
              className="absolute -right-1 top-1 w-2 h-2 opacity-0 hover:opacity-10 cursor-default"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
        </div>
      </div>
    </header>
  )
}
