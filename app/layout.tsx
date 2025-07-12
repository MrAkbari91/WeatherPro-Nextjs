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
  authors: [{ name: "WeatherPro Team" }],
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
