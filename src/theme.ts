/*
weewx-me.teo
Copyright (C) 2024 Pascal Bourque

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use client';

import { blueGrey, cyan } from '@mui/material/colors';
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
      main: '#da3b26'
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
