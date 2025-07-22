import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeatherPro - Modern Weather Forecast App",
  description:
    "Get accurate weather forecasts, hourly predictions, and 7-day outlook with our modern weather app. Features location detection, search, and beautiful weather visualizations.",
  keywords: "weather, forecast, temperature, humidity, wind speed, weather app, climate",
  authors: [{ name: "Dhruv Akbari" }],
  viewport: "width=device-width, initial-scale=1",
}

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
