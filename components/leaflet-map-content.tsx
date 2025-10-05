"use client"

import { useEffect, useRef, useState } from "react"

interface LeafletMapContentProps {
  selectedCity: string
  activeLayers: string[]
  aqiData: any
  mockData: any
  cityData: any
}

const LAYER_TO_PARAM_MAP: Record<string, string[]> = {
  NO2: ["no2"],
  O3: ["o3"],
  HCHO: ["hcho"],
  AI: ["aerosol_index"],
  AOD: ["aerosol_optical_depth"],
  PM: ["pm25", "pm10"], // PM maps to both PM2.5 and PM10
}

const parameterInfo: Record<number, { color: string; name: string; key: string; gradient: Record<number, string> }> = {
  2: {
    color: "#ef4444",
    name: "PM2.5",
    key: "pm25",
    gradient: {
      0.0: "rgba(239, 68, 68, 0)",
      0.2: "rgba(239, 68, 68, 0.15)",
      0.4: "rgba(239, 68, 68, 0.35)",
      0.6: "rgba(239, 68, 68, 0.55)",
      0.8: "rgba(239, 68, 68, 0.75)",
      1.0: "rgba(239, 68, 68, 0.9)",
    },
  },
  3: {
    color: "#84cc16",
    name: "PM10",
    key: "pm10",
    gradient: {
      0.0: "rgba(132, 204, 22, 0)",
      0.2: "rgba(132, 204, 22, 0.15)",
      0.4: "rgba(132, 204, 22, 0.35)",
      0.6: "rgba(132, 204, 22, 0.55)",
      0.8: "rgba(132, 204, 22, 0.75)",
      1.0: "rgba(132, 204, 22, 0.9)",
    },
  },
  7: {
    color: "#a855f7",
    name: "O₃",
    key: "o3",
    gradient: {
      0.0: "rgba(168, 85, 247, 0)",
      0.2: "rgba(168, 85, 247, 0.15)",
      0.4: "rgba(168, 85, 247, 0.35)",
      0.6: "rgba(168, 85, 247, 0.55)",
      0.8: "rgba(168, 85, 247, 0.75)",
      1.0: "rgba(168, 85, 247, 0.9)",
    },
  },
  10: {
    color: "#ef4444",
    name: "NO₂",
    key: "no2",
    gradient: {
      0.0: "rgba(239, 68, 68, 0)",
      0.2: "rgba(239, 68, 68, 0.15)",
      0.4: "rgba(239, 68, 68, 0.35)",
      0.6: "rgba(239, 68, 68, 0.55)",
      0.8: "rgba(239, 68, 68, 0.75)",
      1.0: "rgba(239, 68, 68, 0.9)",
    },
  },
  19: {
    color: "#06b6d4",
    name: "SO₂",
    key: "so2",
    gradient: {
      0.0: "rgba(6, 182, 212, 0)",
      0.2: "rgba(6, 182, 212, 0.15)",
      0.4: "rgba(6, 182, 212, 0.35)",
      0.6: "rgba(6, 182, 212, 0.55)",
      0.8: "rgba(6, 182, 212, 0.75)",
      1.0: "rgba(6, 182, 212, 0.9)",
    },
  },
  130: {
    color: "#f97316",
    name: "HCHO",
    key: "hcho",
    gradient: {
      0.0: "rgba(249, 115, 22, 0)",
      0.2: "rgba(249, 115, 22, 0.15)",
      0.4: "rgba(249, 115, 22, 0.35)",
      0.6: "rgba(249, 115, 22, 0.55)",
      0.8: "rgba(249, 115, 22, 0.75)",
      1.0: "rgba(249, 115, 22, 0.9)",
    },
  },
  140: {
    color: "#8b5cf6",
    name: "Aerosol Index",
    key: "aerosol_index",
    gradient: {
      0.0: "rgba(139, 92, 246, 0)",
      0.2: "rgba(139, 92, 246, 0.15)",
      0.4: "rgba(139, 92, 246, 0.35)",
      0.6: "rgba(139, 92, 246, 0.55)",
      0.8: "rgba(139, 92, 246, 0.75)",
      1.0: "rgba(139, 92, 246, 0.9)",
    },
  },
  141: {
    color: "#ec4899",
    name: "Aerosol Optical Depth",
    key: "aerosol_optical_depth",
    gradient: {
      0.0: "rgba(236, 72, 153, 0)",
      0.2: "rgba(236, 72, 153, 0.15)",
      0.4: "rgba(236, 72, 153, 0.35)",
      0.6: "rgba(236, 72, 153, 0.55)",
      0.8: "rgba(236, 72, 153, 0.75)",
      1.0: "rgba(236, 72, 153, 0.9)",
    },
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

export default function LeafletMapContent({
  selectedCity,
  activeLayers,
  aqiData,
  mockData,
  cityData,
}: LeafletMapContentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const openaqMarkersRef = useRef<any[]>([])
  const heatLayersRef = useRef<Map<string, any>>(new Map())
  const [currentZoom, setCurrentZoom] = useState(5)
  const [isReady, setIsReady] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    if ((window as any).L) {
      setL((window as any).L)
      setIsReady(true)
      return
    }

    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet"
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(cssLink)

    const leafletScript = document.createElement("script")
    leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    leafletScript.async = true
    leafletScript.onload = () => {
      const heatScript = document.createElement("script")
      heatScript.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"
      heatScript.async = true
      heatScript.onload = () => {
        const leafletLib = (window as any).L
        if (leafletLib) {
          delete (leafletLib.Icon.Default.prototype as any)._getIconUrl
          leafletLib.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          })
          setL(leafletLib)
          setIsReady(true)
        }
      }
      document.head.appendChild(heatScript)
    }
    document.head.appendChild(leafletScript)

    return () => {
      // Cleanup is handled by the map instance removal
    }
  }, [])

  useEffect(() => {
    if (!isReady || !L || !mapInstanceRef.current || !cityData) return

    mapInstanceRef.current.setView([cityData.lat, cityData.lng], 5, { animate: true })

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const aqi = aqiData?.current?.aqi || 75
    const aqiColor = getAQIColor(aqi)

    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${aqiColor}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    const marker = L.marker([cityData.lat, cityData.lng], { icon: customIcon }).addTo(mapInstanceRef.current)
    const currentDate = getCurrentDate()
    marker.bindPopup(`
      <div style="text-align: center;">
        <div style="font-weight: bold; font-size: 16px;">${cityData.name}</div>
        <div style="font-size: 24px; font-weight: bold; margin: 4px 0; color: ${aqiColor};">AQI: ${aqi}</div>
        <div style="font-size: 12px; color: #666;">City Center</div>
        <div style="font-size: 12px; color: #999;">${currentDate}</div>
      </div>
    `)
    markersRef.current.push(marker)
  }, [isReady, L, selectedCity, aqiData, cityData])

  useEffect(() => {
    if (!isReady || !L || !mapInstanceRef.current) return

    openaqMarkersRef.current.forEach((marker) => marker.remove())
    openaqMarkersRef.current = []

    heatLayersRef.current.forEach((layer) => {
      if (mapInstanceRef.current && layer) {
        mapInstanceRef.current.removeLayer(layer)
      }
    })
    heatLayersRef.current.clear()

    if (activeLayers.length === 0) {
      return
    }

    const showHeatMap = currentZoom >= 6

    if (showHeatMap) {
      Object.entries(mockData).forEach(([paramKey, points]: [string, any]) => {
        const shouldShow = activeLayers.some((layer) => {
          const mappedParams = LAYER_TO_PARAM_MAP[layer] || [layer.toLowerCase()]
          return mappedParams.includes(paramKey)
        })

        if (!shouldShow) return

        const paramConfig = Object.values(parameterInfo).find((p) => p.key === paramKey)
        if (!paramConfig) return

        const heatPoints = points.map((p: any) => [p.lat, p.lng, p.intensity])

        const heatLayer = L.heatLayer(heatPoints, {
          radius: 45,
          blur: 35,
          minOpacity: 0.2,
          maxZoom: 12,
          max: 1.0,
          gradient: paramConfig.gradient,
        })

        heatLayer.addTo(mapInstanceRef.current)
        heatLayersRef.current.set(paramKey, heatLayer)
      })
    } else {
      Object.entries(mockData).forEach(([paramKey, points]: [string, any]) => {
        const shouldShow = activeLayers.some((layer) => {
          const mappedParams = LAYER_TO_PARAM_MAP[layer] || [layer.toLowerCase()]
          return mappedParams.includes(paramKey)
        })
        if (!shouldShow) return

        const paramConfig = Object.values(parameterInfo).find((p) => p.key === paramKey)
        if (!paramConfig) return

        points.forEach((point: any) => {
          const size = 10 + point.intensity * 8
          const opacity = 0.7 + point.intensity * 0.3

          const markerIcon = L.divIcon({
            className: "openaq-marker",
            html: `<div style="
              background: radial-gradient(circle, ${paramConfig.color}${Math.round(opacity * 255)
                .toString(16)
                .padStart(2, "0")}, ${paramConfig.color}40);
              width: ${size}px; 
              height: ${size}px; 
              border-radius: 50%; 
              border: 2px solid white; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 20px ${paramConfig.color}60;
              animation: pulse 2s ease-in-out infinite;
            "></div>
            <style>
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: ${opacity}; }
                50% { transform: scale(1.1); opacity: ${opacity * 0.8}; }
              }
            </style>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          })

          const marker = L.marker([point.lat, point.lng], { icon: markerIcon }).addTo(mapInstanceRef.current)

          marker.bindPopup(`
            <div style="min-width: 180px; padding: 4px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1f2937;">Monitoring Station</div>
              <div style="
                background: linear-gradient(135deg, ${paramConfig.color}20, ${paramConfig.color}10);
                padding: 8px;
                border-radius: 6px;
                border-left: 3px solid ${paramConfig.color};
                margin-bottom: 8px;
              ">
                <div style="color: ${paramConfig.color}; font-weight: 600; font-size: 13px;">${paramConfig.name}</div>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 8px;
                background: #f9fafb;
                border-radius: 4px;
              ">
                <span style="font-size: 11px; color: #6b7280; font-weight: 500;">Intensity Level</span>
                <span style="font-size: 12px; font-weight: 700; color: ${paramConfig.color};">${(point.intensity * 100).toFixed(0)}%</span>
              </div>
            </div>
          `)

          openaqMarkersRef.current.push(marker)
        })
      })
    }
  }, [isReady, L, mockData, activeLayers, currentZoom])

  useEffect(() => {
    if (!isReady || !L || !mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [cityData.lat, cityData.lng],
      zoom: 5,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    map.on("zoomend", () => {
      setCurrentZoom(map.getZoom())
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isReady, L, cityData])

  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="text-lg font-medium text-muted-foreground">Loading map...</div>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full" />
}
