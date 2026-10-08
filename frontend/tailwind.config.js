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
          bg: '#080c14',
          panel: '#0d131f',
          card: '#121a2a',
          surface: '#182238',
          border: '#1f2d47',
          'border-light': '#2c3e60',
          accent: '#0284c7',
          'accent-glow': '#38bdf8',
          text: '#f1f5f9',
          muted: '#94a3b8',
          dim: '#64748b',
        },
        tactical: {
          critical: '#ef4444',
          high: '#f97316',
          moderate: '#eab308',
          low: '#10b981',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'tactical-glow': '0 0 15px -3px rgba(56, 189, 248, 0.15)',
        'tactical-critical': '0 0 15px -3px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
