/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#f8fafc',
          panel: '#ffffff',
          card: '#ffffff',
          surface: '#f1f5f9',
          border: '#e2e8f0',
          'border-light': '#cbd5e1',
          accent: '#2563eb',
          'accent-glow': '#1d4ed8',
          text: '#0f172a',
          muted: '#475569',
          dim: '#64748b',
        },
        tactical: {
          critical: '#dc2626',
          high: '#ea580c',
          moderate: '#d97706',
          low: '#16a34a',
          cyan: '#0284c7',
          amber: '#d97706',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'tactical-glow': '0 2px 10px -2px rgba(37, 99, 235, 0.15)',
        'tactical-critical': '0 2px 10px -2px rgba(220, 38, 38, 0.15)',
      }
    },
  },
  plugins: [],
}
