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
        marine: {
          950: '#04070e',
          900: '#070d18',
          850: '#0b1324',
          800: '#101c36',
          750: '#152445',
          700: '#1c305c',
          600: '#254178',
          500: '#3359a1',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          glow: '#00e5ff',
          deep: '#0891b2',
        },
        teal: {
          DEFAULT: '#14b8a6',
          deep: '#0d9488',
        },
        status: {
          low: '#10b981',       // Emerald
          'low-bg': 'rgba(16, 185, 129, 0.12)',
          'low-border': 'rgba(16, 185, 129, 0.3)',
          medium: '#f59e0b',    // Amber
          'medium-bg': 'rgba(245, 158, 11, 0.12)',
          'medium-border': 'rgba(245, 158, 11, 0.3)',
          high: '#ef4444',      // Red
          'high-bg': 'rgba(239, 68, 68, 0.12)',
          'high-border': 'rgba(239, 68, 68, 0.3)',
          anomaly: '#a855f7',   // Purple (Unknown Anomaly)
          'anomaly-bg': 'rgba(168, 85, 247, 0.14)',
          'anomaly-border': 'rgba(168, 85, 247, 0.35)',
          ai: '#06b6d4',        // Cyan AI
          'ai-bg': 'rgba(6, 182, 212, 0.14)',
          'ai-border': 'rgba(6, 182, 212, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'sonar-sweep': 'sonarSweep 4s linear infinite',
        'sonar-ping': 'sonarPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-line': 'radarScan 3s linear infinite',
        'ai-glow': 'aiGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        sonarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        sonarPing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '75%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        radarScan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.75' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        aiGlow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2), inset 0 0 5px rgba(6, 182, 212, 0.1)' },
          '100%': { boxShadow: '0 0 16px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(6, 182, 212, 0.25)' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
        'sonar-radial': 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(11, 19, 36, 0.95) 70%, #070d18 100%)',
      }
    },
  },
  plugins: [],
}
