import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeatherPro - Modern Weather Forecast App",
  description:
    "Get accurate weather forecasts, hourly predictions, and a 7-day outlook with our modern weather app. Features include location detection, search, and beautiful weather visualizations.",
  keywords: [
    "weather", "forecast", "temperature", "humidity", "wind speed", "weather app", "climate",
    "meteorology", "weather forecast", "weather conditions", "weather updates", "weather alerts",
    "weather radar", "weather map", "local weather", "global weather", "real-time weather",
    "hourly forecast", "daily forecast", "7-day forecast", "weather widget", "weather API",
    "weather data", "weather information", "weather news", "weather trends", "weather patterns",
    "weather statistics", "weather service", "weather application", "weather software",
    "weather technology", "weather solutions", "Dhruv Akbari", "modern weather app",
    "responsive weather app", "weather app design", "weather app features", "weather app functionality",
    "weather app user interface", "weather app user experience", "weather app development",
    "weather app trends", "weather app innovations", "weather app performance", "weather app reliability",
    "weather app accuracy", "weather app usability", "weather app accessibility", "weather app customization",
    "weather app integration", "weather app compatibility", "weather app updates", "weather app support",
    "weather app community","mr akbari", "mrakbari", "mrakbari91"
  ],
  authors: [{ name: "Dhruv Akbari" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  openGraph: {
    title: "WeatherPro - Modern Weather Forecast App",
    description:
      "Get accurate weather forecasts, hourly predictions, and a 7-day outlook with our modern weather app. Features include location detection, search, and beautiful weather visualizations.",
    url: "https://weather-pro-nextjs.vercel.app/",
    siteName: "WeatherPro",
    images: [
      {
        url: "/weather.svg",
        width: 1200,
        height: 630,
        alt: "WeatherPro Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherPro - Modern Weather Forecast App",
    description:
      "Get accurate weather forecasts, hourly predictions, and a 7-day outlook with our modern weather app. Features include location detection, search, and beautiful weather visualizations.",
    images: ["/weather.svg"],
  },
  icons: {
    icon: "/weather.svg",
    apple: "/weather.svg",
    shortcut: "/weather.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
    },
  },
  colorScheme: "light dark",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/weather.svg" />
        <meta name="google-site-verification" content="M71tdDiU-O499RIu-uqiDLBLkJAVh67t9e107tz2UVk" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
