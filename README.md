# AirGuard: Cleaner Skies Forecast 🌍

A modern web dashboard for air quality forecasting, built for the NASA Space Apps Challenge 2025.

## 🚀 Features

- **Interactive Map** with NASA TEMPO satellite data (NO₂) for October 1, 2025
- **24-Hour AQI Forecast** using rule-based predictions based on ozone and wind speed
- **Smart Alerts** for poor air quality conditions
- **Personalized Health Recommendations** based on current AQI levels
- **Dark/Light Theme Toggle** for comfortable viewing
- **Responsive Design** across all devices

## 📊 Data Sources

- **NASA GIBS/Worldview** - Public TEMPO satellite data (NO₂) without API keys
- **NOAA** - Public weather data (wind speed, temperature)
- **Simulated Realistic Data** - Typical AQI values for cities based on historical trends

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Modern styling
- **Leaflet.js** - Interactive maps
- **Recharts** - Forecast charts
- **SWR** - Client-side data caching
- **Vercel** - Deployment

## 🌐 Live Demo

Test the app live: [https://nasa-air-guard.vercel.app/](https://nasa-air-guard.vercel.app/)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd airguard-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

**Note:** No API keys required! The app uses only public APIs.

## 🌐 Deployment on Vercel

1. Click "Publish" in v0 or use Vercel CLI:
   ```bash
   vercel
   ```

2. Deploy to production:
   ```bash
   vercel --prod
   ```

**No environment variables needed!**

## 🔧 API Endpoints

### GET `/api/aqi?city={city}`

Fetches air quality data for the specified city.

**Parameters:**
- `city` - "NYC" or "LA" (default: "NYC")

**Response:**
```json
{
  "city": "NYC",
  "current": {
    "aqi": 58,
    "timestamp": "2025-10-01T12:00:00Z",
    "pollutants": {
      "pm25": 13.2,
      "pm10": 24.8,
      "o3": 52,
      "no2": 19
    },
    "weather": {
      "wind_speed": 6.8,
      "temperature": 18
    }
  },
  "forecast": [...],
  "alerts": [...],
  "dataSource": "NASA GIBS/Worldview + NOAA",
  "dataDate": "2025-10-01"
}
```

**Caching:** 5 minutes (300 seconds)

## 📈 Forecast Logic

The AQI forecast uses rule-based logic from the data:

- If **O₃ > 70 ppb** and **wind speed < 5 m/s** → AQI increases by 20%
- If **O₃ > 60 ppb** and **wind speed < 6 m/s** → AQI increases by 10%
- Adds diurnal variation (peak around midday)
- Includes slight random variation for realism

## 🗺️ Map

The map uses NASA's public WMTS service for TEMPO NO₂ data:

```
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/TEMPO_L2_NO2_Total_Column/default/2025-10-01/...
```

Data for **October 1, 2025** - the latest available public dataset.

## 🎨 Design

- **Color Scheme:** Blue (primary), neutral tones
- **Typography:** Geist Sans, Geist Mono
- **Components:** shadcn/ui
- **Animations:** Smooth transitions with Tailwind CSS

## 📱 Responsiveness

- **Mobile:** < 768px - Vertical layout
- **Tablet:** 768px - 1024px - 2-column grid
- **Desktop:** > 1024px - Full 3-column grid

## 🔒 Security

- All APIs are public; no keys required
- Server-side API routes for performance optimization
- CORS configured for secure requests

## 🤝 Contributing

Built for NASA Space Apps Challenge 2025. Contributions welcome!

## 📄 License

MIT License

## 🙏 Acknowledgments

- NASA TEMPO Team
- NASA GIBS/Worldview
- NOAA Weather Service
- Vercel Platform