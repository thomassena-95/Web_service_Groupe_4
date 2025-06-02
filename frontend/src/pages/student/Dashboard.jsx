import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Book as BookIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const StudentDashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalReadings: 0,
    pendingReadings: 0,
    validatedReadings: 0
  });
  const [recentReadings, setRecentReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshDashboard = async () => {
    setLoading(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    const handleRefresh = () => {
      refreshDashboard();
    };

    window.addEventListener('readingSubmitted', handleRefresh);
    return () => {
      window.removeEventListener('readingSubmitted', handleRefresh);
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('🚀 Début du chargement des données du dashboard...');
      
      const [readingsResponse, assignmentsResponse] = await Promise.all([
        axios.get('/api/student-readings/me'),
        axios.get('/api/assignments')
      ]);

      console.log('📚 Réponse des lectures:', readingsResponse.data);
      console.log('📖 Réponse des assignments:', assignmentsResponse.data);

      const readings = readingsResponse.data;
      const assignments = assignmentsResponse.data;

      // Associer les données du livre aux lectures
      const readingsWithBookData = readings.map(reading => {
        const assignment = assignments.find(a => a.id === reading.assignment_id);
        return {
          ...reading,
          book: assignment?.book || null
        };
      });

      console.log('📝 Lectures avec données du livre:', readingsWithBookData);

      setStats({
        totalReadings: readings.length,
        pendingReadings: readings.filter(r => r.status === 'en_attente').length,
        validatedReadings: readings.filter(r => r.status === 'valide').length
      });

      setRecentReadings(readingsWithBookData.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 4,
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <BookIcon sx={{ fontSize: 32 }} />
            Bienvenue, {user?.first_name} {user?.last_name}
          </Typography>
          <Tooltip title="Rafraîchir">
            <IconButton 
              onClick={refreshDashboard}
              sx={{
                backgroundColor: theme.palette.primary.main + '10',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '20',
                  transform: 'rotate(180deg)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  mb: 2
                }}>
                  <BookIcon sx={{ 
                    fontSize: 32, 
                    color: theme.palette.primary.main 
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Lectures totales
                  </Typography>
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.primary.main
                  }}
                >
                  {stats.totalReadings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  mb: 2
                }}>
                  <PendingIcon sx={{ 
                    fontSize: 32, 
                    color: theme.palette.warning.main 
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    En attente
                  </Typography>
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.warning.main
                  }}
                >
                  {stats.pendingReadings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  mb: 2
                }}>
                  <CheckCircleIcon sx={{ 
                    fontSize: 32, 
                    color: theme.palette.success.main 
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Validées
                  </Typography>
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.success.main
                  }}
                >
                  {stats.validatedReadings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography 
          variant="h5" 
          sx={{ 
            mt: 6, 
            mb: 3,
            fontWeight: 600,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <BookIcon sx={{ fontSize: 28 }} />
          Dernières lectures
        </Typography>
        <Grid container spacing={3}>
          {recentReadings.map((reading) => (
            <Grid item xs={12} md={4} key={reading.id}>
              <Card sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.primary.main
                    }}
                  >
                    {reading.book?.title || 'Titre non disponible'}
                  </Typography>
                  <Typography 
                    color="textSecondary" 
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    Auteur: {reading.book?.author || 'Auteur non disponible'}
                  </Typography>
                  <Typography 
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    Soumis le {new Date(reading.submitted_at).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: reading.status === 'valide' 
                      ? theme.palette.success.main + '20'
                      : reading.status === 'en_attente'
                      ? theme.palette.warning.main + '20'
                      : theme.palette.error.main + '20',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    <Typography
                      sx={{
                        color: reading.status === 'valide'
                          ? theme.palette.success.main
                          : reading.status === 'en_attente'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                        fontWeight: 500
                      }}
                    >
                      {reading.status === 'valide' ? 'Validé' : 
                       reading.status === 'en_attente' ? 'En attente' : 
                       reading.status === 'refuse' ? 'Refusé' : reading.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentDashboard;
