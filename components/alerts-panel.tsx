"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Settings, Trash2, AlertTriangle } from "lucide-react"
import {
  getAlerts,
  getAlertSettings,
  saveAlertSettings,
  clearAlerts,
  getSeverityColor,
  type AirQualityAlert,
  type AlertSettings,
} from "@/lib/alerts"
import { CITIES_DATA } from "@/lib/cities-data"

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<AirQualityAlert[]>([])
  const [settings, setSettings] = useState<AlertSettings>({ enabled: false, threshold: 100, cities: [] })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setAlerts(getAlerts())
    setSettings(getAlertSettings())
  }, [])

  const handleToggleEnabled = () => {
    const newSettings = { ...settings, enabled: !settings.enabled }
    setSettings(newSettings)
    saveAlertSettings(newSettings)
  }

  const handleThresholdChange = (threshold: number) => {
    const newSettings = { ...settings, threshold }
    setSettings(newSettings)
    saveAlertSettings(newSettings)
  }

  const handleCityToggle = (cityCode: string) => {
    const newCities = settings.cities.includes(cityCode)
      ? settings.cities.filter((c) => c !== cityCode)
      : [...settings.cities, cityCode]
    const newSettings = { ...settings, cities: newCities }
    setSettings(newSettings)
    saveAlertSettings(newSettings)
  }

  const handleClearAlerts = () => {
    clearAlerts()
    setAlerts([])
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {settings.enabled ? (
            <Bell className="w-6 h-6 text-blue-600" />
          ) : (
            <BellOff className="w-6 h-6 text-gray-400" />
          )}
          <div>
            <h2 className="font-bold text-xl text-gray-900">Air Quality Alerts</h2>
            <p className="text-sm text-gray-500">Get notified when AQI exceeds your threshold</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Alert settings"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Enable Alerts</h3>
              <p className="text-sm text-gray-600">Receive notifications for monitored cities</p>
            </div>
            <button
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold (AQI): {settings.threshold}
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={settings.threshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50 (Good)</span>
              <span>200 (Unhealthy)</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Monitor Cities</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {CITIES_DATA.slice(0, 20).map((city) => (
                <label key={city.code} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={settings.cities.includes(city.code)}
                    onChange={() => handleCityToggle(city.code)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {city.name}, {city.country}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Alerts ({alerts.length})</h3>
          {alerts.length > 0 && (
            <button
              onClick={handleClearAlerts}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No alerts yet. Configure your settings to start monitoring.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`rounded-lg border-2 p-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{alert.cityName}</h4>
                    <p className="text-sm opacity-90">
                      AQI reached {alert.currentAQI} (threshold: {alert.threshold})
                    </p>
                  </div>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-xs opacity-75">{formatTimestamp(alert.timestamp)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
