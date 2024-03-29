import { defineConfig } from 'vite-plugin-windicss';
import typography from 'windicss/plugin/typography';
import colors from 'windicss/colors';

export default defineConfig({
  darkMode: 'class',
  plugins: [typography()],
  attributify: true,
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['Montserrat', 'ui-serif', 'Georgia'],
      mono: ['Fira Sans', 'ui-monospace', 'SFMono-Regular'],
    },
    extend: {
      gridTemplateColumns: {
        main: 'min(250px, 30%) 1fr',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              opacity: 0.75,
              fontWeight: '500',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 1,
                color: colors.teal[600],
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            code: { color: 'inherit' },
          },
        },
      },
    },
  },
  shortcuts: {
    bare: 'block text-orange-600 outline-none cursor-pointer hover:underline p-0 border-none bg-none',
    'avatar-border': 'border-2 cursor-pointer border-gray-300',
    nav: 'flex flex-col items-center pt-23px px-50px pb-20px text-0.8rem border-b-1 border-b-gray-400 transition-all duration-200 <sm:border-b-0 <sm:pt-10px <sm:px-10px <sm:pb-2px <sm:border-r-0',
  },
});
