import { createTheme } from "@mui/material/styles";

import 'fontsource-poppins';

export const myTheme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  palette: {
    navbarColor: {
      main: "#3C3A3B",
      light: "#666666",
      dark: "#222222",
    },
    primary: {
      main: "#118C94",
    },
    background: {
      myBackground: "#F4F4F4",
    },
    text: {
      primary: "#3C3A3B",
    },
  },
});