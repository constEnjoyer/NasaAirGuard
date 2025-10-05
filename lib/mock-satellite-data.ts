// Mock satellite data for validation comparison
export interface SatelliteReading {
  lat: number
  lng: number
  value: number
  timestamp: string
  parameter: string
}

export interface GroundStationReading {
  lat: number
  lng: number
  value: number
  timestamp: string
  parameter: string
  stationId: string
  stationName: string
}

export interface ValidationPair {
  satellite: SatelliteReading
  groundStation: GroundStationReading
  difference: number
  percentDifference: number
  status: "good" | "acceptable" | "poor"
}

// Generate mock satellite and ground station data for validation
export function generateValidationData(parameter: string): ValidationPair[] {
  const pairs: ValidationPair[] = []
  const timestamp = new Date().toISOString()

  // Major cities with ground stations across all of North America including Mexico and Central America
  const stations = [
    // United States
    { lat: 40.7128, lng: -74.006, name: "NYC Central", id: "NYC-001" },
    { lat: 40.758, lng: -73.9855, name: "NYC Midtown", id: "NYC-002" },
    { lat: 34.0522, lng: -118.2437, name: "LA Downtown", id: "LA-001" },
    { lat: 34.0689, lng: -118.4452, name: "LA West", id: "LA-002" },
    { lat: 41.8781, lng: -87.6298, name: "Chicago Loop", id: "CHI-001" },
    { lat: 29.7604, lng: -95.3698, name: "Houston Central", id: "HOU-001" },
    { lat: 33.4484, lng: -112.074, name: "Phoenix Metro", id: "PHX-001" },
    { lat: 39.9526, lng: -75.1652, name: "Philadelphia Center", id: "PHL-001" },
    { lat: 47.6062, lng: -122.3321, name: "Seattle Downtown", id: "SEA-001" },
    { lat: 37.7749, lng: -122.4194, name: "San Francisco Bay", id: "SF-001" },
    { lat: 25.7617, lng: -80.1918, name: "Miami Beach", id: "MIA-001" },
    { lat: 33.749, lng: -84.388, name: "Atlanta Midtown", id: "ATL-001" },
    { lat: 39.7392, lng: -104.9903, name: "Denver Metro", id: "DEN-001" },
    { lat: 42.3601, lng: -71.0589, name: "Boston Harbor", id: "BOS-001" },
    { lat: 38.9072, lng: -77.0369, name: "Washington DC", id: "DC-001" },

    // Alaska
    { lat: 61.2181, lng: -149.9003, name: "Anchorage Central", id: "ANC-001" },
    { lat: 64.8378, lng: -147.7164, name: "Fairbanks North", id: "FAI-001" },

    // Canada
    { lat: 43.6532, lng: -79.3832, name: "Toronto Downtown", id: "TOR-001" },
    { lat: 45.5017, lng: -73.5673, name: "Montreal Centre", id: "MTL-001" },
    { lat: 49.2827, lng: -123.1207, name: "Vancouver Metro", id: "VAN-001" },
    { lat: 51.0447, lng: -114.0719, name: "Calgary Central", id: "CAL-001" },
    { lat: 53.5461, lng: -113.4938, name: "Edmonton North", id: "EDM-001" },
    { lat: 45.4215, lng: -75.6972, name: "Ottawa Downtown", id: "OTT-001" },
    { lat: 49.8951, lng: -97.1384, name: "Winnipeg Central", id: "WIN-001" },
    { lat: 44.6488, lng: -63.5752, name: "Halifax Harbor", id: "HAL-001" },

    // Mexico
    { lat: 19.4326, lng: -99.1332, name: "Mexico City Centro", id: "MEX-001" },
    { lat: 19.391, lng: -99.2837, name: "Mexico City West", id: "MEX-002" },
    { lat: 20.6597, lng: -103.3496, name: "Guadalajara Centro", id: "GDL-001" },
    { lat: 25.6866, lng: -100.3161, name: "Monterrey Metro", id: "MTY-001" },
    { lat: 32.5149, lng: -117.0382, name: "Tijuana Centro", id: "TIJ-001" },
    { lat: 19.0414, lng: -98.2063, name: "Puebla Centro", id: "PUE-001" },
    { lat: 21.1619, lng: -86.8515, name: "Cancun Hotel Zone", id: "CUN-001" },

    // Central America
    { lat: 14.6349, lng: -90.5069, name: "Guatemala City", id: "GUA-001" },
    { lat: 13.6929, lng: -89.2182, name: "San Salvador Centro", id: "SAL-001" },
    { lat: 9.9281, lng: -84.0907, name: "San Jose Centro", id: "SJO-001" },
    { lat: 8.9824, lng: -79.5199, name: "Panama City", id: "PTY-001" },
  ]

  stations.forEach((station) => {
    // Ground station reading (baseline)
    const groundValue = Math.random() * 80 + 20 // 20-100 range

    // Satellite reading with some variance
    const variance = (Math.random() - 0.5) * 20 // -10 to +10
    const satelliteValue = Math.max(0, groundValue + variance)

    const difference = satelliteValue - groundValue
    const percentDifference = (difference / groundValue) * 100

    // Determine validation status
    let status: "good" | "acceptable" | "poor"
    if (Math.abs(percentDifference) < 10) {
      status = "good"
    } else if (Math.abs(percentDifference) < 25) {
      status = "acceptable"
    } else {
      status = "poor"
    }

    pairs.push({
      satellite: {
        lat: station.lat,
        lng: station.lng,
        value: satelliteValue,
        timestamp,
        parameter,
      },
      groundStation: {
        lat: station.lat,
        lng: station.lng,
        value: groundValue,
        timestamp,
        parameter,
        stationId: station.id,
        stationName: station.name,
      },
      difference,
      percentDifference,
      status,
    })
  })

  return pairs
}
