"use client"

import { MapPin, Info, TrendingUp, Search, Star } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { CITIES_DATA } from "@/lib/cities-data"
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites"

interface LocationDropdownProps {
  selectedCity: string
  onCityChange: (city: string) => void
  aqiData: any
  onClose: () => void
}

function getAQILevel(aqi: number): { label: string; color: string; bgColor: string } {
  if (aqi <= 50) return { label: "Good", color: "text-green-700", bgColor: "bg-green-50" }
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-700", bgColor: "bg-yellow-50" }
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-700", bgColor: "bg-orange-50" }
  if (aqi <= 200) return { label: "Unhealthy", color: "text-red-700", bgColor: "bg-red-50" }
  if (aqi <= 300) return { label: "Very Unhealthy", color: "text-red-800", bgColor: "bg-red-100" }
  return { label: "Hazardous", color: "text-red-900", bgColor: "bg-red-200" }
}

export default function LocationDropdown({ selectedCity, onCityChange, aqiData, onClose }: LocationDropdownProps) {
  const aqiLevel = aqiData?.current?.aqi ? getAQILevel(aqiData.current.aqi) : null
  const [searchQuery, setSearchQuery] = useState("")
  const [isFav, setIsFav] = useState(false)

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_DATA
    const query = searchQuery.toLowerCase()
    return CITIES_DATA.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query) ||
        city.code.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const currentCity = CITIES_DATA.find((city) => city.code === selectedCity) || CITIES_DATA[0]

  useEffect(() => {
    setIsFav(isFavorite(selectedCity))
  }, [selectedCity])

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(selectedCity)
    } else {
      addFavorite({
        code: currentCity.code,
        name: currentCity.name,
        country: currentCity.country,
      })
    }
    setIsFav(!isFav)
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-md shadow-2xl border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-bold text-xl text-gray-900">Location & Air Quality</h2>
              <p className="text-sm text-gray-500">Select your city and view current conditions</p>
            </div>
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFav ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-gray-400 hover:bg-gray-100"
            }`}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`w-6 h-6 ${isFav ? "fill-yellow-500" : ""}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* City Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => {
                  onCityChange(e.target.value)
                }}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base font-medium max-h-64 overflow-y-auto"
                size={10}
              >
                {filteredCities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name} ({city.country})
                  </option>
                ))}
              </select>
              {filteredCities.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No cities found matching "{searchQuery}"</p>
              )}
            </div>

            {/* City Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Location Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-medium text-gray-900">{currentCity.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude:</span>
                  <span className="font-medium text-gray-900">{currentCity.latDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude:</span>
                  <span className="font-medium text-gray-900">{currentCity.lonDisplay}</span>
                </div>
              </div>
            </div>

            {/* AQI Scale */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">AQI Scale Reference</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-gray-700">Good (0-50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-gray-700">Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span className="text-gray-700">Unhealthy for Sensitive (101-150)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-gray-700">Unhealthy (151-200)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current AQI */}
          {aqiData?.current && aqiLevel && (
            <div className="space-y-4">
              <div className={`${aqiLevel.bgColor} rounded-xl p-6 border-2 border-gray-200 shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Current Air Quality Index</span>
                  <Info className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{aqiData.current.aqi}</div>
                <div className={`text-base font-semibold ${aqiLevel.color} mb-1`}>{aqiLevel.label}</div>
                <div className="text-sm text-gray-600">{currentCity.name}</div>
              </div>

              {/* Pollutant Details */}
              {aqiData.current.pollutants && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-sm text-gray-900">Current Pollutant Levels</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Nitrogen Dioxide (NO₂)</span>
                      <span className="font-semibold text-sm text-gray-900">
                        {aqiData.current.pollutants.no2} μg/m³
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Ozone (O₃)</span>
                      <span className="font-semibold text-sm text-gray-900">{aqiData.current.pollutants.o3} μg/m³</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">PM2.5</span>
                      <span className="font-semibold text-sm text-gray-900">
                        {aqiData.current.pollutants.pm25} μg/m³
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PM10</span>
                      <span className="font-semibold text-sm text-gray-900">
                        {aqiData.current.pollutants.pm10} μg/m³
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
