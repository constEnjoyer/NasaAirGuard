# OpenAQ API Setup

This application uses the OpenAQ API to display real-time air quality monitoring data on the map.

## Getting an OpenAQ API Key

1. Visit [OpenAQ API Documentation](https://docs.openaq.org/)
2. Sign up for a free account at [OpenAQ](https://openaq.org/)
3. Navigate to your account settings to generate an API key
4. Copy your API key

## Adding the API Key to Your Project

### In v0 (Development)

1. Click the **Gear icon** (⚙️) in the top right corner
2. Select **Environment Variables**
3. Add a new environment variable:
   - **Name**: `OPENAQ_API_KEY`
   - **Value**: Your OpenAQ API key
4. Save the changes

### For Production (Vercel)

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add:
   - **Key**: `OPENAQ_API_KEY`
   - **Value**: Your OpenAQ API key
4. Redeploy your application

## What the API Provides

The OpenAQ API provides real-time air quality data from monitoring stations worldwide, including:

- **PM2.5** - Fine particulate matter (Red markers)
- **PM10** - Coarse particulate matter (Green markers)
- **O₃** - Ozone (Purple markers)
- **NO₂** - Nitrogen dioxide (Red markers)
- **SO₂** - Sulfur dioxide (Cyan markers)
- **HCHO** - Formaldehyde (Orange markers)

The map displays monitoring stations as colored markers based on the pollutants they measure, showing localized air quality data across your selected city.
