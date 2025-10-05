// Mock pollution data generator for North America
export interface PollutionPoint {
  lat: number
  lng: number
  intensity: number
  parameterId: number
}

// North America bounds
const NA_BOUNDS = {
  north: 70,
  south: 14,
  west: -170,
  east: -50,
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

const POLLUTION_HOTSPOTS = {
  // United States - Major Cities
  losAngeles: { lat: 34.0522, lng: -118.2437, radius: 1.5 },
  newYork: { lat: 40.7128, lng: -74.006, radius: 1.2 },
  chicago: { lat: 41.8781, lng: -87.6298, radius: 1.0 },
  houston: { lat: 29.7604, lng: -95.3698, radius: 1.3 },
  phoenix: { lat: 33.4484, lng: -112.074, radius: 0.8 },
  philadelphia: { lat: 39.9526, lng: -75.1652, radius: 0.7 },
  sanAntonio: { lat: 29.4241, lng: -98.4936, radius: 0.6 },
  sanDiego: { lat: 32.7157, lng: -117.1611, radius: 0.8 },
  dallas: { lat: 32.7767, lng: -96.797, radius: 0.9 },
  detroit: { lat: 42.3314, lng: -83.0458, radius: 0.8 },
  boston: { lat: 42.3601, lng: -71.0589, radius: 0.7 },
  miami: { lat: 25.7617, lng: -80.1918, radius: 0.8 },
  atlanta: { lat: 33.749, lng: -84.388, radius: 0.9 },
  seattle: { lat: 47.6062, lng: -122.3321, radius: 0.8 },
  denver: { lat: 39.7392, lng: -104.9903, radius: 0.7 },
  lasVegas: { lat: 36.1699, lng: -115.1398, radius: 0.6 },
  portland: { lat: 45.5152, lng: -122.6784, radius: 0.7 },
  minneapolis: { lat: 44.9778, lng: -93.265, radius: 0.7 },
  pittsburg: { lat: 40.4406, lng: -79.9959, radius: 0.7 },
  cleveland: { lat: 41.4993, lng: -81.6944, radius: 0.6 },
  baltimore: { lat: 39.2904, lng: -76.6122, radius: 0.6 },
  sanFrancisco: { lat: 37.7749, lng: -122.4194, radius: 0.9 },
  oakland: { lat: 37.8044, lng: -122.2712, radius: 0.5 },
  sacramento: { lat: 38.5816, lng: -121.4944, radius: 0.6 },
  nashville: { lat: 36.1627, lng: -86.7816, radius: 0.6 },
  memphis: { lat: 35.1495, lng: -90.049, radius: 0.6 },
  louisville: { lat: 38.2527, lng: -85.7585, radius: 0.5 },
  milwaukee: { lat: 43.0389, lng: -87.9065, radius: 0.6 },
  albuquerque: { lat: 35.0844, lng: -106.6504, radius: 0.5 },
  tucson: { lat: 32.2226, lng: -110.9747, radius: 0.5 },
  fresno: { lat: 36.7378, lng: -119.7871, radius: 0.5 },
  mesa: { lat: 33.4152, lng: -111.8315, radius: 0.4 },
  kansasCity: { lat: 39.0997, lng: -94.5786, radius: 0.6 },
  coloradoSprings: { lat: 38.8339, lng: -104.8214, radius: 0.5 },
  raleigh: { lat: 35.7796, lng: -78.6382, radius: 0.5 },
  omaha: { lat: 41.2565, lng: -95.9345, radius: 0.5 },
  longBeach: { lat: 33.7701, lng: -118.1937, radius: 0.5 },
  virginiaBeach: { lat: 36.8529, lng: -75.978, radius: 0.5 },
  newOrleans: { lat: 29.9511, lng: -90.0715, radius: 0.6 },
  tampa: { lat: 27.9506, lng: -82.4572, radius: 0.6 },
  orlando: { lat: 28.5383, lng: -81.3792, radius: 0.6 },
  stLouis: { lat: 38.627, lng: -90.1994, radius: 0.6 },
  cincinnati: { lat: 39.1031, lng: -84.512, radius: 0.6 },
  columbus: { lat: 39.9612, lng: -82.9988, radius: 0.6 },
  indianapolis: { lat: 39.7684, lng: -86.1581, radius: 0.6 },
  charlotte: { lat: 35.2271, lng: -80.8431, radius: 0.6 },
  jacksonville: { lat: 30.3322, lng: -81.6557, radius: 0.5 },
  sanJose: { lat: 37.3382, lng: -121.8863, radius: 0.7 },
  austin: { lat: 30.2672, lng: -97.7431, radius: 0.7 },
  fortWorth: { lat: 32.7555, lng: -97.3308, radius: 0.6 },
  elPaso: { lat: 31.7619, lng: -106.485, radius: 0.5 },
  washington: { lat: 38.9072, lng: -77.0369, radius: 0.8 },

  // Alaska cities
  anchorage: { lat: 61.2181, lng: -149.9003, radius: 0.8 },
  fairbanks: { lat: 64.8378, lng: -147.7164, radius: 0.6 },
  juneau: { lat: 58.3019, lng: -134.4197, radius: 0.4 },
  sitka: { lat: 57.0531, lng: -135.33, radius: 0.3 },
  ketchikan: { lat: 55.3422, lng: -131.6461, radius: 0.3 },

  // Major Canadian cities
  toronto: { lat: 43.6532, lng: -79.3832, radius: 1.2 },
  montreal: { lat: 45.5017, lng: -73.5673, radius: 1.0 },
  vancouver: { lat: 49.2827, lng: -123.1207, radius: 1.0 },
  calgary: { lat: 51.0447, lng: -114.0719, radius: 0.9 },
  edmonton: { lat: 53.5461, lng: -113.4938, radius: 0.8 },
  ottawa: { lat: 45.4215, lng: -75.6972, radius: 0.7 },
  winnipeg: { lat: 49.8951, lng: -97.1384, radius: 0.6 },
  quebec: { lat: 46.8139, lng: -71.208, radius: 0.6 },
  hamilton: { lat: 43.2557, lng: -79.8711, radius: 0.5 },
  kitchener: { lat: 43.4516, lng: -80.4925, radius: 0.4 },
  london: { lat: 42.9849, lng: -81.2453, radius: 0.5 },
  halifax: { lat: 44.6488, lng: -63.5752, radius: 0.5 },
  victoria: { lat: 48.4284, lng: -123.3656, radius: 0.4 },
  saskatoon: { lat: 52.1332, lng: -106.67, radius: 0.5 },
  regina: { lat: 50.4452, lng: -104.6189, radius: 0.4 },
  stjohns: { lat: 47.5615, lng: -52.7126, radius: 0.4 },
  kelowna: { lat: 49.888, lng: -119.496, radius: 0.4 },
  barrie: { lat: 44.3894, lng: -79.6903, radius: 0.3 },
  guelph: { lat: 43.5448, lng: -80.2482, radius: 0.3 },
  kingston: { lat: 44.2312, lng: -76.486, radius: 0.3 },
  thunderBay: { lat: 48.3809, lng: -89.2477, radius: 0.4 },
  sudbury: { lat: 46.4917, lng: -80.993, radius: 0.4 },
  sherbrooke: { lat: 45.4042, lng: -71.8929, radius: 0.3 },
  troisRivieres: { lat: 46.3432, lng: -72.5428, radius: 0.3 },
  saintJohn: { lat: 45.2733, lng: -66.0633, radius: 0.3 },
  moncton: { lat: 46.0878, lng: -64.7782, radius: 0.3 },

  // Mexico - Major Cities
  mexicoCity: { lat: 19.4326, lng: -99.1332, radius: 1.8 },
  guadalajara: { lat: 20.6597, lng: -103.3496, radius: 1.0 },
  monterrey: { lat: 25.6866, lng: -100.3161, radius: 1.0 },
  puebla: { lat: 19.0414, lng: -98.2063, radius: 0.7 },
  tijuana: { lat: 32.5149, lng: -117.0382, radius: 0.8 },
  leon: { lat: 21.1212, lng: -101.6807, radius: 0.6 },
  juarez: { lat: 31.6904, lng: -106.4245, radius: 0.7 },
  zapopan: { lat: 20.7214, lng: -103.3918, radius: 0.5 },
  cancun: { lat: 21.1619, lng: -86.8515, radius: 0.5 },
  merida: { lat: 20.9674, lng: -89.5926, radius: 0.6 },
  aguascalientes: { lat: 21.8853, lng: -102.2916, radius: 0.5 },
  hermosillo: { lat: 29.0729, lng: -110.9559, radius: 0.5 },
  saltillo: { lat: 25.4232, lng: -100.9737, radius: 0.5 },
  mexicali: { lat: 32.6245, lng: -115.4523, radius: 0.5 },
  culiacan: { lat: 24.8091, lng: -107.394, radius: 0.5 },
  acapulco: { lat: 16.8531, lng: -99.8237, radius: 0.4 },
  chihuahua: { lat: 28.6353, lng: -106.0889, radius: 0.5 },
  queretaro: { lat: 20.5888, lng: -100.3899, radius: 0.6 },
  morelia: { lat: 19.706, lng: -101.1949, radius: 0.5 },
  torreon: { lat: 25.5428, lng: -103.4068, radius: 0.5 },
  veracruz: { lat: 19.1738, lng: -96.1342, radius: 0.5 },

  // Central America
  guatemalaCity: { lat: 14.6349, lng: -90.5069, radius: 0.8 },
  sanSalvador: { lat: 13.6929, lng: -89.2182, radius: 0.7 },
  tegucigalpa: { lat: 14.0723, lng: -87.1921, radius: 0.6 },
  managua: { lat: 12.1364, lng: -86.2514, radius: 0.6 },
  sanJoseCR: { lat: 9.9281, lng: -84.0907, radius: 0.6 },
  panamaCity: { lat: 8.9824, lng: -79.5199, radius: 0.7 },
  belize: { lat: 17.251, lng: -88.759, radius: 0.4 },
}

// Generate clustered points around hotspots
function generateClusteredPoints(parameterId: number, count: number): PollutionPoint[] {
  const points: PollutionPoint[] = []
  const hotspots = Object.values(POLLUTION_HOTSPOTS)

  // 70% of points clustered around hotspots
  const clusteredCount = Math.floor(count * 0.7)
  const randomCount = count - clusteredCount

  // Generate clustered points
  for (let i = 0; i < clusteredCount; i++) {
    const hotspot = hotspots[Math.floor(Math.random() * hotspots.length)]

    // Generate point within hotspot radius using normal distribution
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.sqrt(Math.random()) * hotspot.radius

    points.push({
      lat: hotspot.lat + distance * Math.cos(angle),
      lng: hotspot.lng + distance * Math.sin(angle),
      intensity: randomInRange(0.5, 1.0), // Higher intensity in hotspots
      parameterId,
    })
  }

  // Generate random scattered points
  for (let i = 0; i < randomCount; i++) {
    points.push({
      lat: randomInRange(NA_BOUNDS.south, NA_BOUNDS.north),
      lng: randomInRange(NA_BOUNDS.west, NA_BOUNDS.east),
      intensity: randomInRange(0.2, 0.6), // Lower intensity for scattered points
      parameterId,
    })
  }

  return points
}

// Generate mock pollution data for all pollutants
export function generateMockPollutionData() {
  return {
    // Particulate Matter
    pm25: generateClusteredPoints(2, 200),
    pm10: generateClusteredPoints(3, 180),

    // Gases
    o3: generateClusteredPoints(7, 220), // Ozone
    no2: generateClusteredPoints(10, 250), // Nitrogen Dioxide
    so2: generateClusteredPoints(19, 150), // Sulfur Dioxide
    co: generateClusteredPoints(5, 180), // Carbon Monoxide

    // Formaldehyde and VOCs
    hcho: generateClusteredPoints(130, 160), // Formaldehyde

    // Aerosols
    aerosol_index: generateClusteredPoints(140, 200),
    aerosol_optical_depth: generateClusteredPoints(141, 180),

    // Additional tropospheric pollutants
    nh3: generateClusteredPoints(150, 140), // Ammonia
    ch4: generateClusteredPoints(160, 170), // Methane
    benzene: generateClusteredPoints(170, 130), // Benzene
    toluene: generateClusteredPoints(171, 120), // Toluene
    black_carbon: generateClusteredPoints(180, 150), // Black Carbon
    organic_carbon: generateClusteredPoints(181, 140), // Organic Carbon
  }
}
