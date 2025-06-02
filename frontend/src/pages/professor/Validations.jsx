import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Validations = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/student-readings');
      setAssignments(response.data);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération des lectures:', error);
      setError('Erreur lors de la récupération des lectures');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (readingId) => {
    try {
      await axios.patch(`/api/student-readings/${readingId}`, {
        status: 'validated'
      });
      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setError('Erreur lors de la validation');
    }
  };

  const handleReject = async (readingId) => {
    try {
      await axios.patch(`/api/student-readings/${readingId}`, {
        status: 'rejected'
      });
      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      setError('Erreur lors du rejet');
    }
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenDialog(true);
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.assignment?.book?.title?.toLowerCase().includes(filter.toLowerCase()) ||
    assignment.student?.first_name?.toLowerCase().includes(filter.toLowerCase()) ||
    assignment.student?.last_name?.toLowerCase().includes(filter.toLowerCase())
  );

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
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
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
          Validations des Lectures
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ 
              width: '100%', 
              maxWidth: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }
            }}
            InputProps={{
              startAdornment: <FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredAssignments.map((reading) => (
            <Grid item xs={12} md={6} key={reading.id}>
              <Card sx={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary
                        }}
                      >
                        {reading.assignment?.book?.title}
                      </Typography>
                      <Typography 
                        color="textSecondary" 
                        gutterBottom
                        sx={{ 
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        Étudiant: {reading.student?.first_name} {reading.student?.last_name}
                      </Typography>
                      <Typography 
                        color="textSecondary" 
                        gutterBottom
                        sx={{ 
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        Classe: {reading.assignment?.classroom?.name}
                      </Typography>
                      <Typography 
                        color="textSecondary" 
                        gutterBottom
                        sx={{ 
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        Soumis le: {new Date(reading.submitted_at).toLocaleDateString('fr-FR')}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={reading.status === 'validated' ? 'Validé' : 
                                 reading.status === 'rejected' ? 'Rejeté' : 'En attente'}
                          color={reading.status === 'validated' ? 'success' : 
                                 reading.status === 'rejected' ? 'error' : 'warning'}
                          sx={{
                            fontWeight: 500,
                            borderRadius: '8px',
                            '&:hover': {
                              opacity: 0.9
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      gap: 1,
                      '& .MuiIconButton-root': {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }
                    }}>
                      <Tooltip title="Voir les détails">
                        <IconButton 
                          onClick={() => handleViewDetails(reading)}
                          sx={{ 
                            color: theme.palette.info.main,
                            '&:hover': {
                              backgroundColor: theme.palette.info.light + '20'
                            }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {reading.status === 'en_attente' && (
                        <>
                          <Tooltip title="Valider">
                            <IconButton 
                              onClick={() => handleValidate(reading.id)}
                              sx={{ 
                                color: theme.palette.success.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.success.light + '20'
                                }
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rejeter">
                            <IconButton 
                              onClick={() => handleReject(reading.id)}
                              sx={{ 
                                color: theme.palette.error.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.error.light + '20'
                                }
                              }}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            Détails de la lecture
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedAssignment && (
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {selectedAssignment.assignment?.book?.title}
                </Typography>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  mb: 3
                }}>
                  <Typography paragraph>
                    <strong>Auteur:</strong> {selectedAssignment.assignment?.book?.author}
                  </Typography>
                  <Typography paragraph>
                    <strong>Étudiant:</strong> {selectedAssignment.student?.first_name} {selectedAssignment.student?.last_name}
                  </Typography>
                  <Typography paragraph>
                    <strong>Classe:</strong> {selectedAssignment.assignment?.classroom?.name}
                  </Typography>
                  <Typography paragraph>
                    <strong>Date de soumission:</strong> {new Date(selectedAssignment.submitted_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
                <Typography paragraph>
                  <strong>Statut:</strong>
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={selectedAssignment.status === 'validated' ? 'Validé' : 
                           selectedAssignment.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    color={selectedAssignment.status === 'validated' ? 'success' : 
                           selectedAssignment.status === 'rejected' ? 'error' : 'warning'}
                    sx={{
                      fontWeight: 500,
                      borderRadius: '8px'
                    }}
                  />
                </Box>
                <Typography paragraph>
                  <strong>Résumé:</strong>
                </Typography>
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'grey.50', 
                  borderRadius: '12px',
                  maxHeight: '300px',
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography>
                    {selectedAssignment.summary}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Fermer
            </Button>
            {selectedAssignment?.status === 'en_attente' && (
              <>
                <Button
                  onClick={() => handleValidate(selectedAssignment.id)}
                  color="success"
                  variant="contained"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Valider
                </Button>
                <Button
                  onClick={() => handleReject(selectedAssignment.id)}
                  color="error"
                  variant="contained"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Rejeter
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Validations;
