import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Dashboard as DashboardIcon,
  Class as ClassIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Book as BookIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (user) {
      if (user.role === 'professor') {
        navigate('/professor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const getNavigationLinks = () => {
    if (!user) return null;

    if (user.role === 'professor') {
      return (
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          alignItems: 'center'
        }}>
          <Tooltip title="Tableau de bord">
            <Button 
              color="primary" 
              onClick={() => navigate('/professor/dashboard')}
              startIcon={<DashboardIcon />}
              sx={{ 
                color: theme.palette.primary.main,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Tableau de bord
            </Button>
          </Tooltip>
          <Tooltip title="Classes">
            <Button 
              color="primary" 
              onClick={() => navigate('/professor/classrooms')}
              startIcon={<ClassIcon />}
              sx={{ 
                color: theme.palette.primary.main,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Classes
            </Button>
          </Tooltip>
          <Tooltip title="Livres">
            <Button 
              color="primary" 
              onClick={() => navigate('/professor/books')}
              startIcon={<MenuBookIcon />}
              sx={{ 
                color: theme.palette.primary.main,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Livres
            </Button>
          </Tooltip>
          <Tooltip title="Devoirs">
            <Button 
              color="primary" 
              onClick={() => navigate('/professor/assignments')}
              startIcon={<AssignmentIcon />}
              sx={{ 
                color: theme.palette.primary.main,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Devoirs
            </Button>
          </Tooltip>
          <Tooltip title="Validations">
            <Button 
              color="primary" 
              onClick={() => navigate('/professor/validations')}
              startIcon={<CheckCircleIcon />}
              sx={{ 
                color: theme.palette.primary.main,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Validations
            </Button>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        alignItems: 'center'
      }}>
        <Tooltip title="Tableau de bord">
          <Button 
            color="primary" 
            onClick={() => navigate('/student/dashboard')}
            startIcon={<DashboardIcon />}
            sx={{ 
              color: theme.palette.primary.main,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.04)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            Tableau de bord
          </Button>
        </Tooltip>
        <Tooltip title="Lectures">
          <Button 
            color="primary" 
            onClick={() => navigate('/student/readings')}
            startIcon={<BookIcon />}
            sx={{ 
              color: theme.palette.primary.main,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.04)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            Lectures
          </Button>
        </Tooltip>
      </Box>
    );
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
        background: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: theme.palette.primary.main,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              opacity: 0.8,
              transition: 'opacity 0.2s ease'
            }
          }}
          onClick={handleLogoClick}
        >
          <MenuBookIcon sx={{ fontSize: '1.5rem' }} />
          ESME Reading
        </Typography>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getNavigationLinks()}
            <Tooltip title="Profil">
              <IconButton
                onClick={handleMenu}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  mt: 1
                }
              }}
            >
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  }
                }}
              >
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ 
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Connexion
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/register')}
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Inscription
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
