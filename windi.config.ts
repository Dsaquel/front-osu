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
    bare: 'block outline-none cursor-pointer hover:underline p-0 border-none bg-none',
    hovered: 'border cursor-pointer rounded border-gray-300',
    navigation: '',
  },
});
