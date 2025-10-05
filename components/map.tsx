"use client"

import { useEffect, useState } from "react"
import { useAQIData } from "@/lib/use-aqi-data"

interface MapComponentProps {
  selectedCity: "NYC" | "LA"
  activeLayers: string[]
}

const cityCoordinates = {
  NYC: { lat: 40.7128, lng: -74.006, name: "New York City" },
  LA: { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
}

const layerConfigs = {
  NO2: {
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_NO2_Tropospheric_Vertical_Column_V03/default/{TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
    attribution: "NASA GIBS TEMPO NO₂",
  },
  O3: {
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_O3_Total_Column_V03/default/{TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
    attribution: "NASA GIBS TEMPO O₃",
  },
  HCHO: {
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_HCHO_Total_Vertical_Column_V03/default/{TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
    attribution: "NASA GIBS TEMPO HCHO",
  },
  AI: {
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_Aerosol_Index_340_380nm_V03/default/{TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
    attribution: "NASA GIBS TEMPO AI",
  },
  AOD: {
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L3_Aerosol_Optical_Depth_500nm_V03/default/{TIME}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
    attribution: "NASA GIBS TEMPO AOD",
  },
}

function getCurrentDate(): string {
  const now = new Date()
  now.setDate(now.getDate() - 1)
  return now.toISOString().split("T")[0]
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e"
  if (aqi <= 100) return "#eab308"
  if (aqi <= 150) return "#f97316"
  return "#ef4444"
}

function MapContent({ selectedCity, activeLayers }: MapComponentProps) {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = require("react-leaflet")
  const L = require("leaflet")
  const { data: aqiData } = useAQIData(selectedCity)

  function createCustomIcon(color: string, size = 24) {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  function MapController({ selectedCity }: { selectedCity: "NYC" | "LA" }) {
    const map = useMap()

    useEffect(() => {
      const coords = cityCoordinates[selectedCity]
      map.setView([coords.lat, coords.lng], 7, { animate: true })
    }, [selectedCity, map])

    return null
  }

  function GIBSLayers({ activeLayers }: { activeLayers: string[] }) {
    const map = useMap()

    useEffect(() => {
      const layers: any[] = []
      const currentDate = getCurrentDate()

      activeLayers.forEach((layerId) => {
        const config = layerConfigs[layerId as keyof typeof layerConfigs]
        if (config) {
          const layerUrl = config.url.replace("{TIME}", currentDate)

          const layer = L.tileLayer(layerUrl, {
            attribution: config.attribution,
            maxZoom: 12,
            minZoom: 4,
            opacity: 0.7,
            errorTileUrl:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          })
          layer.addTo(map)
          layers.push(layer)

          console.log(`[v0] Loading layer ${layerId} with URL:`, layerUrl)
        }
      })

      return () => {
        layers.forEach((layer) => map.removeLayer(layer))
      }
    }, [activeLayers, map])

    return null
  }

  const coords = cityCoordinates[selectedCity]
  const aqi = aqiData?.current.aqi || 75
  const aqiColor = getAQIColor(aqi)
  const currentDate = getCurrentDate()

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={7}
      className="w-full h-full"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <GIBSLayers activeLayers={activeLayers} />
      <MapController selectedCity={selectedCity} />

      <Marker position={[coords.lat, coords.lng]} icon={createCustomIcon(aqiColor, 32)}>
        <Popup>
          <div className="text-center">
            <div className="font-bold text-base">{coords.name}</div>
            <div className="text-2xl font-bold my-1" style={{ color: aqiColor }}>
              AQI: {aqi}
            </div>
            <div className="text-xs text-gray-600">NASA TEMPO Data</div>
            <div className="text-xs text-gray-500">{currentDate}</div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default function MapComponent({ selectedCity, activeLayers }: MapComponentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return <MapContent selectedCity={selectedCity} activeLayers={activeLayers} />
}
