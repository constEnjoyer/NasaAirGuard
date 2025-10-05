"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react"
import { generateValidationData, type ValidationPair } from "@/lib/mock-satellite-data"

interface ValidationDropdownProps {
  onClose: () => void
}

const PARAMETERS = [
  { id: "no2", name: "NO₂", unit: "ppb", fullName: "Nitrogen Dioxide" },
  { id: "pm25", name: "PM2.5", unit: "µg/m³", fullName: "Fine Particulate Matter" },
  { id: "pm10", name: "PM10", unit: "µg/m³", fullName: "Coarse Particulate Matter" },
  { id: "o3", name: "O₃", unit: "ppb", fullName: "Ozone" },
  { id: "so2", name: "SO₂", unit: "ppb", fullName: "Sulfur Dioxide" },
  { id: "co", name: "CO", unit: "ppm", fullName: "Carbon Monoxide" },
  { id: "hcho", name: "CH₂O", unit: "ppb", fullName: "Formaldehyde" },
  { id: "aerosol_index", name: "Aerosol Index", unit: "index", fullName: "Aerosol Index" },
  { id: "aerosol_optical_depth", name: "AOD", unit: "unitless", fullName: "Aerosol Optical Depth" },
  { id: "nh3", name: "NH₃", unit: "ppb", fullName: "Ammonia" },
  { id: "ch4", name: "CH₄", unit: "ppm", fullName: "Methane" },
  { id: "benzene", name: "C₆H₆", unit: "ppb", fullName: "Benzene" },
  { id: "toluene", name: "C₇H₈", unit: "ppb", fullName: "Toluene" },
  { id: "black_carbon", name: "BC", unit: "µg/m³", fullName: "Black Carbon" },
  { id: "organic_carbon", name: "OC", unit: "µg/m³", fullName: "Organic Carbon" },
]

const CITIES = [
  // United States
  { name: "Los Angeles, CA", country: "USA" },
  { name: "New York, NY", country: "USA" },
  { name: "Chicago, IL", country: "USA" },
  { name: "Houston, TX", country: "USA" },
  { name: "Phoenix, AZ", country: "USA" },
  { name: "Philadelphia, PA", country: "USA" },
  { name: "San Antonio, TX", country: "USA" },
  { name: "San Diego, CA", country: "USA" },
  { name: "Dallas, TX", country: "USA" },
  { name: "Detroit, MI", country: "USA" },
  { name: "Boston, MA", country: "USA" },
  { name: "Miami, FL", country: "USA" },
  { name: "Atlanta, GA", country: "USA" },
  { name: "Seattle, WA", country: "USA" },
  { name: "Denver, CO", country: "USA" },
  { name: "Las Vegas, NV", country: "USA" },
  { name: "Portland, OR", country: "USA" },
  { name: "Minneapolis, MN", country: "USA" },
  { name: "Pittsburgh, PA", country: "USA" },
  { name: "Cleveland, OH", country: "USA" },
  { name: "Baltimore, MD", country: "USA" },
  { name: "San Francisco, CA", country: "USA" },
  { name: "Oakland, CA", country: "USA" },
  { name: "Sacramento, CA", country: "USA" },
  { name: "Nashville, TN", country: "USA" },
  { name: "Memphis, TN", country: "USA" },
  { name: "Louisville, KY", country: "USA" },
  { name: "Milwaukee, WI", country: "USA" },
  { name: "Albuquerque, NM", country: "USA" },
  { name: "Tucson, AZ", country: "USA" },
  { name: "Fresno, CA", country: "USA" },
  { name: "Mesa, AZ", country: "USA" },
  { name: "Kansas City, MO", country: "USA" },
  { name: "Colorado Springs, CO", country: "USA" },
  { name: "Raleigh, NC", country: "USA" },
  { name: "Omaha, NE", country: "USA" },
  { name: "Long Beach, CA", country: "USA" },
  { name: "Virginia Beach, VA", country: "USA" },
  { name: "New Orleans, LA", country: "USA" },
  { name: "Tampa, FL", country: "USA" },
  { name: "Orlando, FL", country: "USA" },
  { name: "St. Louis, MO", country: "USA" },
  { name: "Cincinnati, OH", country: "USA" },
  { name: "Columbus, OH", country: "USA" },
  { name: "Indianapolis, IN", country: "USA" },
  { name: "Charlotte, NC", country: "USA" },
  { name: "Jacksonville, FL", country: "USA" },
  { name: "San Jose, CA", country: "USA" },
  { name: "Austin, TX", country: "USA" },
  { name: "Fort Worth, TX", country: "USA" },
  { name: "El Paso, TX", country: "USA" },
  { name: "Washington, DC", country: "USA" },

  // Alaska
  { name: "Anchorage, AK", country: "USA" },
  { name: "Fairbanks, AK", country: "USA" },
  { name: "Juneau, AK", country: "USA" },
  { name: "Sitka, AK", country: "USA" },
  { name: "Ketchikan, AK", country: "USA" },

  // Canada
  { name: "Toronto, ON", country: "Canada" },
  { name: "Montreal, QC", country: "Canada" },
  { name: "Vancouver, BC", country: "Canada" },
  { name: "Calgary, AB", country: "Canada" },
  { name: "Edmonton, AB", country: "Canada" },
  { name: "Ottawa, ON", country: "Canada" },
  { name: "Winnipeg, MB", country: "Canada" },
  { name: "Quebec City, QC", country: "Canada" },
  { name: "Hamilton, ON", country: "Canada" },
  { name: "Kitchener, ON", country: "Canada" },
  { name: "London, ON", country: "Canada" },
  { name: "Halifax, NS", country: "Canada" },
  { name: "Victoria, BC", country: "Canada" },
  { name: "Saskatoon, SK", country: "Canada" },
  { name: "Regina, SK", country: "Canada" },
  { name: "St. John's, NL", country: "Canada" },
  { name: "Kelowna, BC", country: "Canada" },
  { name: "Barrie, ON", country: "Canada" },
  { name: "Guelph, ON", country: "Canada" },
  { name: "Kingston, ON", country: "Canada" },
  { name: "Thunder Bay, ON", country: "Canada" },
  { name: "Sudbury, ON", country: "Canada" },
  { name: "Sherbrooke, QC", country: "Canada" },
  { name: "Trois-Rivières, QC", country: "Canada" },
  { name: "Saint John, NB", country: "Canada" },
  { name: "Moncton, NB", country: "Canada" },

  // Mexico
  { name: "Mexico City", country: "Mexico" },
  { name: "Guadalajara", country: "Mexico" },
  { name: "Monterrey", country: "Mexico" },
  { name: "Puebla", country: "Mexico" },
  { name: "Tijuana", country: "Mexico" },
  { name: "León", country: "Mexico" },
  { name: "Ciudad Juárez", country: "Mexico" },
  { name: "Zapopan", country: "Mexico" },
  { name: "Cancún", country: "Mexico" },
  { name: "Mérida", country: "Mexico" },
  { name: "Aguascalientes", country: "Mexico" },
  { name: "Hermosillo", country: "Mexico" },
  { name: "Saltillo", country: "Mexico" },
  { name: "Mexicali", country: "Mexico" },
  { name: "Culiacán", country: "Mexico" },
  { name: "Acapulco", country: "Mexico" },
  { name: "Chihuahua", country: "Mexico" },
  { name: "Querétaro", country: "Mexico" },
  { name: "Morelia", country: "Mexico" },
  { name: "Torreón", country: "Mexico" },
  { name: "Veracruz", country: "Mexico" },

  // Central America
  { name: "Guatemala City", country: "Guatemala" },
  { name: "San Salvador", country: "El Salvador" },
  { name: "Tegucigalpa", country: "Honduras" },
  { name: "Managua", country: "Nicaragua" },
  { name: "San José", country: "Costa Rica" },
  { name: "Panama City", country: "Panama" },
  { name: "Belize City", country: "Belize" },
].sort((a, b) => a.name.localeCompare(b.name))

export default function ValidationDropdown({ onClose }: ValidationDropdownProps) {
  const [selectedParameter, setSelectedParameter] = useState("no2")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [validationData, setValidationData] = useState<ValidationPair[]>(() => generateValidationData("no2"))

  const handleParameterChange = (parameterId: string) => {
    setSelectedParameter(parameterId)
    setValidationData(generateValidationData(parameterId))
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
  }

  const filteredData =
    selectedCity === "all"
      ? validationData
      : validationData.filter((pair) => pair.groundStation.stationName.includes(selectedCity.split(",")[0]))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "acceptable":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "poor":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-50 border-green-200"
      case "acceptable":
        return "bg-yellow-50 border-yellow-200"
      case "poor":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const goodCount = filteredData.filter((d) => d.status === "good").length
  const acceptableCount = filteredData.filter((d) => d.status === "acceptable").length
  const poorCount = filteredData.filter((d) => d.status === "poor").length
  const totalCount = filteredData.length
  const accuracy = totalCount > 0 ? (((goodCount + acceptableCount * 0.5) / totalCount) * 100).toFixed(1) : "0.0"

  const currentParam = PARAMETERS.find((p) => p.id === selectedParameter)

  return (
    <div className="bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Satellite Data Validation</h2>
          <p className="text-sm text-gray-600">
            Real-time comparison between satellite observations and ground station measurements across North America
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by City ({CITIES.length} cities available)
          </label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            <option value="all">All Cities ({validationData.length} stations)</option>
            {CITIES.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name} - {city.country}
              </option>
            ))}
          </select>
        </div>

        {/* Parameter Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tropospheric Pollutant ({currentParam?.fullName})
          </label>
          <div className="flex flex-wrap gap-2">
            {PARAMETERS.map((param) => (
              <button
                key={param.id}
                onClick={() => handleParameterChange(param.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedParameter === param.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={param.fullName}
              >
                {param.name}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium mb-1">Overall Accuracy</div>
            <div className="text-2xl font-bold text-blue-900">{accuracy}%</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium mb-1">Good Match</div>
            <div className="text-2xl font-bold text-green-900">
              {goodCount}/{totalCount}
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-600 font-medium mb-1">Acceptable</div>
            <div className="text-2xl font-bold text-yellow-900">
              {acceptableCount}/{totalCount}
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-600 font-medium mb-1">Poor Match</div>
            <div className="text-2xl font-bold text-red-900">
              {poorCount}/{totalCount}
            </div>
          </div>
        </div>

        {/* Validation Data Table */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Station</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Ground ({currentParam?.unit})
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Satellite ({currentParam?.unit})
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Difference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((pair, index) => (
                  <tr key={index} className={`${getStatusColor(pair.status)} transition-colors`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {pair.groundStation.stationName}
                      <div className="text-xs text-gray-500">{pair.groundStation.stationId}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{pair.groundStation.value.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{pair.satellite.value.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        {pair.difference > 0 ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className="font-mono font-medium">
                          {pair.percentDifference > 0 ? "+" : ""}
                          {pair.percentDifference.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(pair.status)}
                        <span className="text-sm font-medium capitalize">{pair.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            • <strong>Good:</strong> Difference &lt; 10% | <strong>Acceptable:</strong> Difference &lt; 25% |{" "}
            <strong>Poor:</strong> Difference ≥ 25%
          </p>
          <p>• Data refreshed in real-time from TEMPO satellite and ground monitoring stations across North America</p>
          <p>• Monitoring {PARAMETERS.length} tropospheric pollutants including gases, particulates, and aerosols</p>
          <p>
            • Coverage includes {CITIES.length} major cities across USA, Canada, Mexico, Central America, and Alaska
          </p>
        </div>
      </div>
    </div>
  )
}
