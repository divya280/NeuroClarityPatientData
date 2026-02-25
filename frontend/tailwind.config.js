/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f4f7fb',
          100: '#e1e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#020617',
          primary: '#2563eb', // Pure Clinical Blue
          secondary: '#6366f1', // Surgical Indigo
          accent: '#10b981', // Healthy Emerald
        }
      },
      boxShadow: {
        'medical-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'medical-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'medical-gradient': 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))',
      }
    },
  },
  plugins: [],
}
