"use client"

import { Download, TableIcon, FileSpreadsheet, Calendar } from "lucide-react"
import * as XLSX from "xlsx"

interface ExportDropdownProps {
  selectedCity: "NYC" | "LA"
  aqiData: any
  onClose: () => void
}

const pollutants = [
  { id: "NO2", name: "Nitrogen Dioxide (NO₂)" },
  { id: "HCHO", name: "Formaldehyde (CH₂O)" },
  { id: "AI", name: "Aerosol Index" },
  { id: "PM", name: "Particulate Matter (PM)" },
  { id: "O3", name: "Ozone (O₃)" },
]

export default function ExportDropdown({ selectedCity, aqiData, onClose }: ExportDropdownProps) {
  const generateTableData = () => {
    const data = []
    const today = new Date("2025-10-05")

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

      const row: any = {
        Date: dateStr,
        Location: selectedCity === "NYC" ? "New York City" : "Los Angeles",
      }

      pollutants.forEach((pollutant) => {
        const baseValue = Math.random() * 50 + 20
        const variation = (Math.random() - 0.5) * 10
        row[pollutant.name] = (baseValue + variation).toFixed(2)
      })

      row["AQI"] = Math.floor(Math.random() * 100 + 30)
      row["Temperature (°F)"] = Math.floor(Math.random() * 30 + 60)
      row["Humidity (%)"] = Math.floor(Math.random() * 40 + 40)

      data.push(row)
    }

    return data
  }

  const exportToExcel = () => {
    const data = generateTableData()
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Air Quality Data")

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 12 },
    ]

    // Write to binary string and create blob
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create download link and trigger download
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `AirGuard_Export_${selectedCity}_2025-10-05.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const tableData = generateTableData().slice(-10) // Show last 10 days (most recent) instead of first 10 days

  return (
    <div className="w-full bg-background/95 backdrop-blur-md shadow-2xl border-b border-border max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">Export Data</h2>
              <p className="text-sm text-muted-foreground">Download comprehensive air quality reports</p>
            </div>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
        </div>

        {/* Export Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm text-blue-900">Date Range</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">30 Days</p>
            <p className="text-xs text-blue-700 mt-1">Historical data included</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TableIcon className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-sm text-purple-900">Data Points</h3>
            </div>
            <p className="text-2xl font-bold text-purple-900">240+</p>
            <p className="text-xs text-purple-700 mt-1">Measurements per export</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-sm text-green-900">Format</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">XLSX</p>
            <p className="text-xs text-green-700 mt-1">Excel compatible format</p>
          </div>
        </div>

        {/* Data Table Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-base text-gray-900">Data Preview</h3>
              <span className="text-xs text-gray-500 ml-2">(Last 10 days)</span>
            </div>
            <div className="text-xs text-gray-500">
              Full export contains <span className="font-semibold text-gray-700">30 days</span> of data
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  {pollutants.map((pollutant) => (
                    <th
                      key={pollutant.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                    >
                      {pollutant.id}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    AQI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Temp (°F)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Humidity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">{row.Date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{row.Location}</td>
                    {pollutants.map((pollutant) => (
                      <td key={pollutant.id} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {row[pollutant.name]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{row.AQI}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row["Temperature (°F)"]}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{row["Humidity (%)"]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">What's Included</h3>
            <ul className="text-sm text-blue-700 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>30 days of historical air quality measurements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>All 5 pollutants: NO₂, Formaldehyde, Aerosol Index, PM, O₃</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>AQI values and weather conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Location and timestamp information</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-semibold text-sm text-green-900 mb-2">Export Features</h3>
            <ul className="text-sm text-green-700 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Excel-compatible XLSX format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Optimized column widths for readability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Ready for data analysis and visualization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Timestamped filename for easy organization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
