import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: () => ({
          boxShadow: 'none',
          textTransform: 'none',
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px',
          borderRadius: 20,
        },
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
  shape: {
    borderRadius: 10,
  },
});

/**
 * #000000
 * #263E73
 * #fca311
 * #e5e5e5
 * #fefefe
 */
