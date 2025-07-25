import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      default: '#f4f6fa',
      paper: '#fff',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
    error: {
      main: '#d32f2f',
    },
    info: {
      main: '#0288d1',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 8px 40px 0 rgba(25, 118, 210, 0.18)',
          background: 'linear-gradient(135deg, #f4f6fa 0%, #fff 100%)',
          padding: '0',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '0.01em',
          padding: '20px 32px 16px 32px',
          marginBottom: 0,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px 32px 8px 32px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 32px 24px 32px',
          background: 'transparent',
        },
      },
    },
  },
});

export default theme;
