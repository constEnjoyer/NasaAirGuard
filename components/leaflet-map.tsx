"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useAQIData } from "@/lib/use-aqi-data"
import { generateMockPollutionData } from "@/lib/mock-pollution-data"
import { getCityByCode } from "@/lib/cities-data"

interface LeafletMapProps {
  selectedCity: string
  activeLayers: string[]
}

const LeafletMapContent = dynamic(() => import("./leaflet-map-content"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="text-lg font-medium text-muted-foreground">Loading map...</div>
      </div>
    </div>
  ),
})

export default function LeafletMap({ selectedCity, activeLayers }: LeafletMapProps) {
  const { data: aqiData } = useAQIData(selectedCity)
  const [mockData] = useState(() => generateMockPollutionData())
  const cityData = getCityByCode(selectedCity)

  if (!cityData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground">City not found</div>
        </div>
      </div>
    )
  }

  return (
    <LeafletMapContent
      selectedCity={selectedCity}
      activeLayers={activeLayers}
      aqiData={aqiData}
      mockData={mockData}
      cityData={cityData}
    />
  )
}
