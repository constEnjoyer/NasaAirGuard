"use client"

import type React from "react"

import { MapPin, Layers, Info, AlertCircle, TrendingUp } from "lucide-react"
import { useAQIData } from "@/lib/use-aqi-data"
import TrendsChart from "./trends-chart"
import AlertsBox, { type AlertsBoxRef } from "./alerts-box"
import { useState } from "react"

interface SidebarProps {
  selectedCity: "NYC" | "LA"
  onCityChange: (city: "NYC" | "LA") => void
  activeLayers: string[]
  onLayersChange: (layers: string[]) => void
  alertsRef: React.RefObject<AlertsBoxRef>
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
  return { label: "Unhealthy", color: "text-red-600" }
}

export default function Sidebar({ selectedCity, onCityChange, activeLayers, onLayersChange, alertsRef }: SidebarProps) {
  const { data: aqiData } = useAQIData(selectedCity)
  const [showTrends, setShowTrends] = useState(false)

  const toggleLayer = (layerId: string) => {
    if (activeLayers.includes(layerId)) {
      onLayersChange(activeLayers.filter((id) => id !== layerId))
    } else {
      onLayersChange([...activeLayers, layerId])
    }
  }

  const aqiLevel = aqiData ? getAQILevel(aqiData.current.aqi) : null

  return (
    <aside className="w-80 bg-sidebar border-r border-sidebar-border overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-6">
        {/* City Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <MapPin className="w-5 h-5 text-sidebar-primary" />
            <h2 className="font-semibold text-lg">Location</h2>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value as "NYC" | "LA")}
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="NYC">New York City</option>
            <option value="LA">Los Angeles</option>
          </select>
        </div>

        {/* Current AQI */}
        {aqiData && (
          <div className="bg-card rounded-lg p-4 border border-border space-y-2">
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

        <button
          onClick={() => setShowTrends(!showTrends)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">7-дневные тренды</span>
          </div>
          <span className="text-xs">{showTrends ? "Скрыть" : "Показать"}</span>
        </button>

        {showTrends && (
          <div className="animate-in slide-in-from-top">
            <TrendsChart selectedCity={selectedCity} />
          </div>
        )}

        {/* Alerts Box */}
        <div className="animate-in slide-in-from-top">
          <AlertsBox ref={alertsRef} selectedCity={selectedCity} />
        </div>

        {/* Layer Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <Layers className="w-5 h-5 text-sidebar-primary" />
            <h2 className="font-semibold text-lg">NASA TEMPO Layers</h2>
          </div>
          <div className="space-y-2">
            {availableLayers.map((layer) => (
              <label
                key={layer.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent cursor-pointer transition-colors"
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
        </div>

        {/* Info Box */}
        <div className="bg-accent/50 rounded-lg p-4 border border-border space-y-2">
          <div className="flex items-center gap-2 text-accent-foreground">
            <AlertCircle className="w-4 h-4" />
            <h3 className="font-semibold text-sm">About TEMPO</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            NASA's TEMPO mission provides hourly air quality measurements across North America, tracking pollutants like
            NO₂, O₃, and aerosols from geostationary orbit.
          </p>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-sidebar-foreground">AQI Scale</h3>
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
              <span>Unhealthy (151+)</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
