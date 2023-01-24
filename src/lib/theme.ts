import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
  },
  palette: {
    primary: {
      main: '#14213d',
    },
    secondary: {
      main: '#fca311',
    },
  },
});

/**
 * #000000
 * #263E73
 * #fca311
 * #e5e5e5
 * #fefefe
 */
