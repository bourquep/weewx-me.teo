'use client';
import { blueGrey, cyan, orange } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)'
  },
  palette: {
    primary: {
      main: cyan[400]
    },
    secondary: {
      main: orange[400]
    },
    grey: blueGrey
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
