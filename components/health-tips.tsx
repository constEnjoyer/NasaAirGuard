"use client"

import { Lightbulb, Filter } from "lucide-react"
import { useState } from "react"
import { HEALTH_TIPS, getTipsForAQI, type HealthTip } from "@/lib/pollutant-info"

interface HealthTipsProps {
  aqi?: number
}

const CATEGORY_LABELS: Record<HealthTip["category"], string> = {
  prevention: "Prevention",
  indoor: "Indoor",
  outdoor: "Outdoor",
  sensitive: "Sensitive Groups",
}

const CATEGORY_COLORS: Record<HealthTip["category"], string> = {
  prevention: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
  indoor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
  outdoor: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30",
  sensitive: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
}

export default function HealthTips({ aqi }: HealthTipsProps) {
  const [selectedCategory, setSelectedCategory] = useState<HealthTip["category"] | "all">("all")

  const tips = aqi ? getTipsForAQI(aqi) : HEALTH_TIPS
  const filteredTips = selectedCategory === "all" ? tips : tips.filter((tip) => tip.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
        <div>
          <h2 className="font-bold text-xl text-foreground">Health Protection Tips</h2>
          <p className="text-sm text-muted-foreground">Practical advice to protect yourself from air pollution</p>
        </div>
      </div>

      {aqi && (
        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
          <p className="text-sm text-yellow-900 dark:text-yellow-200">
            <span className="font-semibold">Current AQI: {aqi}</span> - Showing recommended tips for current air quality
            conditions
          </p>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All Tips
        </button>
        {(Object.keys(CATEGORY_LABELS) as HealthTip["category"][]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => (
          <div key={tip.id} className={`rounded-lg border-2 p-4 ${CATEGORY_COLORS[tip.category]}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{tip.title}</h3>
                <p className="text-sm opacity-90">{tip.description}</p>
                <span className="inline-block mt-2 text-xs font-medium opacity-75">
                  {CATEGORY_LABELS[tip.category]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tips available for the selected category.</p>
        </div>
      )}
    </div>
  )
}
