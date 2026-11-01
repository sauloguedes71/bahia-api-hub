import plugin from 'tailwindcss/plugin'
import colors from 'tailwindcss/colors'

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const PALETTES = ['slate', 'sky', 'emerald', 'amber', 'red', 'indigo', 'violet', 'blue']

const hexToChannels = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}
// Espelha a escala no tema escuro (500 vai para 400 para manter contraste).
const mirror = (shade) => (shade === '500' ? '400' : SHADES[SHADES.length - 1 - SHADES.indexOf(shade)])

const themeColors = plugin(({ addBase }) => {
  const light = { '--white': '255 255 255' }
  const dark = { '--white': hexToChannels(colors.slate['900']) }
  for (const p of PALETTES) {
    for (const s of SHADES) {
      light[`--${p}-${s}`] = hexToChannels(colors[p][s])
      dark[`--${p}-${s}`] = hexToChannels(colors[p][mirror(s)])
    }
  }
  addBase({ ':root': light, '.dark': dark })
})

const palette = (p) =>
  Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--${p}-${s}) / <alpha-value>)`]))

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      boxShadow: {
        soft: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -6px rgb(15 23 42 / 0.08)',
        'soft-lg': '0 2px 4px rgb(15 23 42 / 0.04), 0 20px 40px -12px rgb(15 23 42 / 0.14)',
      },
      colors: {
        white: 'rgb(var(--white) / <alpha-value>)',
        ...Object.fromEntries(PALETTES.map((p) => [p, palette(p)])),
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        brand: '#2563eb',
        modulo: {
          clima: '#f59e0b',
          economia: '#0ea5e9',
          educacao: '#4f46e5',
          eleicao: '#8b5cf6',
          populacao: '#10b981',
        },
      },
    },
  },
  plugins: [themeColors],
}