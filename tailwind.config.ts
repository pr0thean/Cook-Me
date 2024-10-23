import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: 'hsl(var(--color-white) / <alpha-value>)', // #EDEDED
        black: 'hsl(var(--color-black) / <alpha-value>)', // #272727
        gray: 'hsl(var(--color-gray) / <alpha-value>)', // #747474
        orange: 'hsl(var(--color-orange) / <alpha-value>)', // #FF652F
        yellow: 'hsl(var(--color-yellow) / <alpha-value>)', // #FFE400
        green: 'hsl(var(--color-green) / <alpha-value>)', // #14A76C
        'blue-gray': 'hsl(var(--color-blue-gray) / <alpha-value>)', // #686D76
        'blue-gray-dark': 'hsl(var(--color-blue-gray-dark) / <alpha-value>)', // #373A40

        'off-black': 'hsl(var(--color-off-black) / <alpha-value>)',
        'off-white': 'hsl(var(--color-off-white) / <alpha-value>)',
      },

      fontFamily: {
        hero: 'var(--font-permanent-marker)',
        'not-found': 'var(--font-medival-sharp)',
      },
    },
  },
  plugins: [],
}
export default config
