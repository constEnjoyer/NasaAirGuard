"use client"

import { Activity } from "lucide-react"
import PollutantChart from "./pollutant-chart"

interface PollutantDropdownProps {
  selectedCity: "NYC" | "LA"
  aqiData: any
  activeLayers: string[]
  onLayersChange: (layers: string[]) => void
  onClose: () => void
}

const pollutants = [
  { id: "NO2", name: "Nitrogen Dioxide (NO₂)", color: "bg-red-500", description: "Traffic and industrial emissions" },
  {
    id: "HCHO",
    name: "Formaldehyde (CH₂O)",
    color: "bg-orange-500",
    description: "Industrial processes and combustion",
  },
  { id: "AI", name: "Aerosol Index", color: "bg-yellow-500", description: "Atmospheric particles and dust" },
  { id: "PM", name: "Particulate Matter (PM)", color: "bg-purple-500", description: "Fine particles in the air" },
  { id: "O3", name: "Ozone (O₃)", color: "bg-blue-500", description: "Ground-level ozone pollution" },
]

export default function PollutantDropdown({
  selectedCity,
  aqiData,
  activeLayers,
  onLayersChange,
  onClose,
}: PollutantDropdownProps) {
  const toggleLayer = (layerId: string) => {
    if (activeLayers.includes(layerId)) {
      onLayersChange(activeLayers.filter((id) => id !== layerId))
    } else {
      onLayersChange([...activeLayers, layerId])
    }
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-md shadow-2xl border-b border-gray-200 max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-bold text-xl text-gray-900">Air Pollutants Dashboard</h2>
              <p className="text-sm text-gray-500">Real-time monitoring with interactive charts</p>
            </div>
          </div>
        </div>

        {/* Charts Grid - All pollutants with charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {pollutants.map((pollutant) => (
            <div
              key={pollutant.id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Pollutant Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${pollutant.color} mt-1.5`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900">{pollutant.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{pollutant.description}</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayers.includes(pollutant.id)}
                    onChange={() => toggleLayer(pollutant.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Chart */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <PollutantChart pollutantId={pollutant.id} selectedCity={selectedCity} aqiData={aqiData} />
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">About NASA TEMPO</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            NASA's TEMPO mission provides hourly air quality measurements across North America, tracking pollutants like
            NO₂, O₃, and aerosols from geostationary orbit. This data helps monitor air quality trends and protect
            public health. Use the checkboxes to toggle pollutant layers on the map.
          </p>
        </div>
      </div>
    </div>
  )
}
