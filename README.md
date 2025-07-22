# 🌦️ WeatherPro – Redesigned & Reimagined

**WeatherPro** has been completely redesigned with a stunning, modern interface that addresses all key concerns: visual clarity, responsive design, dynamic themes, real API integration, and automatic location detection. Built with **Next.js 15**, **React 19**, and **Tailwind CSS**, WeatherPro now sets the standard for open-source weather dashboards.

---

## 🚀 Major Improvements

### 🎨 Atmospheric Dynamic Themes

- **Sunny**: Warm yellow-orange-red gradients  
- **Rainy**: Cool gray-blue gradients  
- **Cloudy**: Soft gray-blue combinations  
- **Stormy**: Dark purple-gray atmospheres  
- **Snowy**: Light blue-white winter themes  
- **Foggy**: Muted gray atmospheric effects  

### ✨ Smooth Load Animations

- Staggered element animations with delays  
- Fade-in, slide-up, and scale effects  
- Rotating weather icons on load  
- Progressive reveal of all components  

### 📍 Smart Location Detection (Updated)

- **Permission Check**: Uses Permissions API to check location status before requesting  
- **Graceful Fallback**: Automatically loads default city (New York) if location is denied  
- **No Forced Prompts**: Respects user's location preferences  
- **Silent Detection**: Tries location silently if already granted  

#### 📍 Location Status Management

- Tracks permission states: detecting, granted, denied, unavailable  
- User feedback with clear status banners  
- Optional button to re-enable location  
- App always works even without permission  

#### ⚡ Robust Error Handling

- Handles API, permission, and timeout errors  
- Friendly user-facing messages  
- Smart fallback logic for continuous operation  

### 🌐 Real OpenWeatherMap API Integration

- Live current weather data  
- Real 5-day / 3-hour forecast  
- Accurate weather icons and real-time updates  

### 🔄 Complete Data Integration

- Temperature, humidity, wind, pressure, visibility  
- Real sunrise/sunset times and precipitation info  
- All weather data updates on location change  

### 📱 7-Day Forecast Scrolling

- Vertical scroll with hidden scrollbar  
- Smooth scroll and responsive height  
- Adaptive overflow handling  

### 🧩 Component-Based Design

- Modular structure with reusable components  
- Clean layout using Tailwind utilities  
- Consistent spacing, alignment, and scaling  

### 🎨 Weather-App Specific Styling

- Real-time clock, country flags, weather cards  
- Glassmorphism effects and color-coded metrics  

### 📊 Enhanced Features

- Retry functionality and loading spinners  
- Background themes reflect real conditions  
- Responsive and accessible across all devices  

---

## 🛠 Tech Stack

- [Next.js 15](https://nextjs.org/)  
- [React 19](https://react.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Radix UI](https://www.radix-ui.com/)  
- [Recharts](https://recharts.org/)  
- [React Hook Form](https://react-hook-form.com/)  
- [Zod](https://zod.dev/)  
- [date-fns](https://date-fns.org/)  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MrAkbari91/WeatherPro-Nextjs.git
cd weather-pro
````

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using Bun
bun install

# Using pnpm
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

### 3. Start the Development Server

```bash
# Using Bun
bun dev

# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 📦 Building for Production

```bash
# Using Bun
bun build && bun start

# Using pnpm
pnpm build && pnpm start

# Using npm
npm run build && npm start

# Using yarn
yarn build && yarn start
```

> 💡 **Note:** Make sure you have [Bun](https://bun.sh/docs/installation) installed globally if you're using it.

---

## 🤝 Contributing

WeatherPro is open-source and welcomes contributions!
Feel free to **fork**, submit **pull requests**, or suggest **features**.

> Please follow best practices and open an issue for major changes.

---

## 👤 Author

**Dhruv Akbari**
📧 [dhruvakbari303@gmail.com](mailto:dhruvakbari303@gmail.com)

---

## 📄 License

Licensed under the **MIT License**.
You are free to use, modify, and distribute this project as you like.
