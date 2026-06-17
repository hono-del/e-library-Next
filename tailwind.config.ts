import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          dark: '#1e40af',
        },
        secondary: {
          DEFAULT: '#3B82F6',
        },
        accent: {
          DEFAULT: '#F59E0B',
        },
        warning: {
          DEFAULT: '#DC2626',
        },
        success: {
          DEFAULT: '#10B981',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-jp)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
