"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import TopNavbar from "@/components/top-navbar"
import HealthAdvisoryPanel from "@/components/health-advisory-panel"
import FavoritesPanel from "@/components/favorites-panel"
import AlertsPanel from "@/components/alerts-panel"
import PollutantEducation from "@/components/pollutant-education"
import HealthTips from "@/components/health-tips"
import View3D from "@/components/view-3d"
import { AIChatPanel } from "@/components/ai-chat-panel"
import { useAQIData } from "@/lib/use-aqi-data"
import { getCityByCode } from "@/lib/cities-data"
import { SWRConfig } from "swr"
import { Star, Bell, BookOpen, Lightbulb, Map, Globe } from "lucide-react"

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  ),
})

type TabType = "health" | "favorites" | "alerts" | "education" | "tips"
type ViewMode = "map" | "3d"

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("NYC")
  const [activeLayers, setActiveLayers] = useState<string[]>(["NO2"])
  const [showHealthPanel, setShowHealthPanel] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("health")
  const [viewMode, setViewMode] = useState<ViewMode>("map")

  const { data: aqiData } = useAQIData(selectedCity)
  const cityData = getCityByCode(selectedCity)
  const currentAQI = aqiData?.current?.aqi || 75

  return (
    <SWRConfig
      value={{
        refreshInterval: 300000,
        revalidateOnFocus: false,
        dedupingInterval: 60000,
      }}
    >
      <div className="h-screen overflow-hidden bg-background">
        <TopNavbar
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          activeLayers={activeLayers}
          onLayersChange={setActiveLayers}
        />

        <main className="h-full w-full overflow-hidden pt-16 flex">
          {/* Map/3D View Section */}
          <div className={`${showHealthPanel ? "w-2/3" : "w-full"} h-full transition-all duration-300 relative`}>
            <div className="absolute top-4 left-4 z-[1000] flex gap-2 bg-card rounded-lg shadow-lg p-1 border border-border">
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "map"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-accent"
                }`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "3d"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground hover:bg-accent"
                }`}
              >
                <Globe className="w-4 h-4" />
                3D View
              </button>
            </div>

            {viewMode === "map" ? (
              <LeafletMap selectedCity={selectedCity} activeLayers={activeLayers} />
            ) : (
              <View3D selectedCity={selectedCity} activeLayers={activeLayers} />
            )}
          </div>

          {/* Sidebar Panel */}
          {showHealthPanel && (
            <div className="w-1/3 h-full overflow-y-auto bg-muted border-l border-border">
              {/* Tab Navigation */}
              <div className="sticky top-0 bg-card border-b border-border z-10">
                <div className="flex items-center justify-between p-4">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveTab("health")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "health"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Health
                    </button>
                    <button
                      onClick={() => setActiveTab("favorites")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "favorites"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      Favorites
                    </button>
                    <button
                      onClick={() => setActiveTab("alerts")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "alerts"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      Alerts
                    </button>
                    <button
                      onClick={() => setActiveTab("education")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "education"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Learn
                    </button>
                    <button
                      onClick={() => setActiveTab("tips")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "tips"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />
                      Tips
                    </button>
                  </div>
                  <button
                    onClick={() => setShowHealthPanel(false)}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium"
                  >
                    Hide
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "health" && (
                  <HealthAdvisoryPanel aqi={currentAQI} cityName={cityData?.name || "Unknown"} />
                )}
                {activeTab === "favorites" && <FavoritesPanel onCitySelect={setSelectedCity} />}
                {activeTab === "alerts" && <AlertsPanel />}
                {activeTab === "education" && <PollutantEducation />}
                {activeTab === "tips" && <HealthTips aqi={currentAQI} />}
              </div>
            </div>
          )}

          {/* Toggle Button when panel is hidden */}
          {!showHealthPanel && (
            <button
              onClick={() => setShowHealthPanel(true)}
              className="fixed right-4 top-20 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors text-sm font-medium z-[9999]"
            >
              Show Info Panel
            </button>
          )}
        </main>

        {/* AI Chat Panel */}
        <AIChatPanel />
      </div>
    </SWRConfig>
  )
}
