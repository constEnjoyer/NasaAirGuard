"use client"

import { useState } from "react"
import { Satellite, ChevronDown, Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"
import { useAQIData } from "@/lib/use-aqi-data"
import PollutantDropdown from "./pollutant-dropdown"
import LocationDropdown from "./location-dropdown"
import ValidationDropdown from "./validation-dropdown"
import ExportDropdown from "./export-dropdown"

interface TopNavbarProps {
  selectedCity: string
  onCityChange: (city: string) => void
  activeLayers: string[]
  onLayersChange: (layers: string[]) => void
}

export default function TopNavbar({ selectedCity, onCityChange, activeLayers, onLayersChange }: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { data: aqiData } = useAQIData(selectedCity)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Satellite className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AirGuard</h1>
              <p className="text-xs text-muted-foreground">NASA TEMPO Monitor</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleDropdown("location")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground text-sm font-medium"
            >
              Location
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openDropdown === "location" ? "rotate-180" : ""}`}
              />
            </button>

            <button
              onClick={() => toggleDropdown("pollutants")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground text-sm font-medium"
            >
              Pollutants
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openDropdown === "pollutants" ? "rotate-180" : ""}`}
              />
            </button>

            <button
              onClick={() => toggleDropdown("validation")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground text-sm font-medium"
            >
              Validation
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openDropdown === "validation" ? "rotate-180" : ""}`}
              />
            </button>

            <button
              onClick={() => toggleDropdown("export")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground text-sm font-medium"
            >
              Export
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openDropdown === "export" ? "rotate-180" : ""}`}
              />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {openDropdown === "location" && (
        <>
          <div className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm" onClick={closeDropdown} />
          <div className="fixed top-[57px] left-0 right-0 z-[999] animate-[slideDown_0.3s_ease-out]">
            <LocationDropdown
              selectedCity={selectedCity}
              onCityChange={onCityChange}
              aqiData={aqiData}
              onClose={closeDropdown}
            />
          </div>
        </>
      )}

      {openDropdown === "pollutants" && (
        <>
          <div className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm" onClick={closeDropdown} />
          <div className="fixed top-[57px] left-0 right-0 z-[999] animate-[slideDown_0.3s_ease-out]">
            <PollutantDropdown
              selectedCity={selectedCity}
              aqiData={aqiData}
              activeLayers={activeLayers}
              onLayersChange={onLayersChange}
              onClose={closeDropdown}
            />
          </div>
        </>
      )}

      {openDropdown === "validation" && (
        <>
          <div className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm" onClick={closeDropdown} />
          <div className="fixed top-[57px] left-0 right-0 z-[999] animate-[slideDown_0.3s_ease-out]">
            <ValidationDropdown onClose={closeDropdown} />
          </div>
        </>
      )}

      {openDropdown === "export" && (
        <>
          <div className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm" onClick={closeDropdown} />
          <div className="fixed top-[57px] left-0 right-0 z-[999] animate-[slideDown_0.3s_ease-out]">
            <ExportDropdown selectedCity={selectedCity} aqiData={aqiData} onClose={closeDropdown} />
          </div>
        </>
      )}
    </>
  )
}
