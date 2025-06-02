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
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          '& svg': {
            fontSize: '2rem',
            color: color,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }
        }}>
          {icon}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              ml: 2,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            color: color,
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProfessorDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingValidations: 0,
    totalAssignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Récupérer les classes
      const classroomsResponse = await axios.get('/api/classrooms');
      const totalClasses = classroomsResponse.data.length;
      
      // Calculer le nombre total d'étudiants
      const totalStudents = classroomsResponse.data.reduce(
        (acc, classroom) => acc + (classroom.students?.length || 0),
        0
      );

      // Récupérer les devoirs
      const assignmentsResponse = await axios.get('/api/assignments');
      const totalAssignments = assignmentsResponse.data.length;
      
      // Compter les validations en attente
      const pendingValidations = assignmentsResponse.data.filter(
        assignment => !assignment.status || assignment.status === 'pending'
      ).length;

      setStats({
        totalClasses,
        totalStudents,
        pendingValidations,
        totalAssignments,
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      setError('Erreur lors de la récupération des statistiques');
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-classroom':
        navigate('/professor/classrooms');
        break;
      case 'assign-book':
        navigate('/professor/assignments');
        break;
      case 'validate-readings':
        navigate('/professor/validations');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box sx={{ 
        mt: 4, 
        mb: 4,
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 4,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '60px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px'
            }
          }}
        >
          Tableau de bord
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Classes"
              value={stats.totalClasses}
              icon={<SchoolIcon sx={{ color: theme.palette.primary.main }} />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Étudiants"
              value={stats.totalStudents}
              icon={<PeopleIcon sx={{ color: theme.palette.secondary.main }} />}
              color={theme.palette.secondary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Validations en attente"
              value={stats.pendingValidations}
              icon={<AssignmentIcon sx={{ color: theme.palette.warning.main }} />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Devoirs"
              value={stats.totalAssignments}
              icon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>

        {/* Section des actions rapides */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Actions rapides
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                  }
                }}
                onClick={() => handleQuickAction('create-classroom')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.primary.main
                    }}
                  >
                    Créer une nouvelle classe
                  </Typography>
                  <Typography 
                    color="textSecondary"
                    sx={{ 
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}
                  >
                    Ajouter une nouvelle classe et y inviter des étudiants
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                  }
                }}
                onClick={() => handleQuickAction('assign-book')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.primary.main
                    }}
                  >
                    Assigner un livre
                  </Typography>
                  <Typography 
                    color="textSecondary"
                    sx={{ 
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}
                  >
                    Créer un nouveau devoir de lecture
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                  }
                }}
                onClick={() => handleQuickAction('validate-readings')}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.primary.main
                    }}
                  >
                    Valider les lectures
                  </Typography>
                  <Typography 
                    color="textSecondary"
                    sx={{ 
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}
                  >
                    Voir et valider les lectures en attente
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfessorDashboard;
