"use client"

import {
  AlertTriangle,
  Heart,
  Users,
  Home,
  Shield,
  Activity,
  Info,
  AlertCircle,
  AlertOctagon,
  Check,
} from "lucide-react"
import { getAQICategory, getHealthAdvisories, getSensitivePopulationAlerts } from "@/lib/aqi-utils"

interface HealthAdvisoryPanelProps {
  aqi: number
  cityName: string
}

const iconMap: Record<string, any> = {
  "alert-triangle": AlertTriangle,
  "alert-octagon": AlertOctagon,
  alert: AlertCircle,
  heart: Heart,
  users: Users,
  home: Home,
  shield: Shield,
  activity: Activity,
  info: Info,
  check: Check,
}

export default function HealthAdvisoryPanel({ aqi, cityName }: HealthAdvisoryPanelProps) {
  const category = getAQICategory(aqi)
  const advisories = getHealthAdvisories(aqi)
  const sensitiveAlerts = getSensitivePopulationAlerts(aqi)

  return (
    <div className="space-y-4">
      {/* AQI Category Card */}
      <div
        className="rounded-xl p-6 border-2 shadow-lg"
        style={{
          backgroundColor: category.bgColor,
          borderColor: category.color,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">Air Quality Index</div>
            <div className="text-4xl font-bold mb-2" style={{ color: category.color }}>
              {aqi}
            </div>
            <div className="text-lg font-semibold mb-3" style={{ color: category.color }}>
              {category.level}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">{category.healthImplications}</p>
            {category.cautionaryStatement !== "None" && (
              <div className="mt-3 p-3 bg-white/60 rounded-lg border" style={{ borderColor: category.color }}>
                <p className="text-sm font-medium text-gray-800">
                  <AlertCircle className="w-4 h-4 inline mr-2" style={{ color: category.color }} />
                  {category.cautionaryStatement}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Advisories */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Health Advisories for {cityName}
        </h3>
        <div className="space-y-3">
          {advisories.map((advisory, index) => {
            const Icon = iconMap[advisory.icon] || AlertCircle
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  advisory.priority === "high"
                    ? "bg-red-50 border-red-500"
                    : advisory.priority === "medium"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: advisory.color }} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{advisory.title}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{advisory.content}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sensitive Population Alerts */}
      {sensitiveAlerts.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-300 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-900">
            <Users className="w-5 h-5" />
            Sensitive Population Alerts
          </h3>
          <div className="grid gap-2">
            {sensitiveAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-800">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
