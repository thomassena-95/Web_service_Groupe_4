import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container, useTheme } from '@mui/material';

const Layout = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.palette.background.default,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      }}
    >
      <Navbar />
      <Container 
        component="main" 
        maxWidth={false}
        sx={{ 
          flexGrow: 1, 
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.5s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 }
          }
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
