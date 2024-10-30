'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)'
  },
  colorSchemes: {
    light: true,
    dark: true
  },
  cssVariables: true
});

// This will automatically adjust font sizes for different screen sizes
theme = responsiveFontSizes(theme);

export default theme;
