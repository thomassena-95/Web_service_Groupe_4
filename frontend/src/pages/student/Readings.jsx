import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';
import {
  Add as AddIcon,
  Book as BookIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const Readings = () => {
  const [assignments, setAssignments] = useState([]);
  const [myReadings, setMyReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [summary, setSummary] = useState('');
  const [selectedReading, setSelectedReading] = useState(null);
  const [openReadingDialog, setOpenReadingDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Début du chargement des données...');
      
      const [assignmentsResponse, readingsResponse] = await Promise.all([
        axios.get(ENDPOINTS.ASSIGNMENTS.LIST),
        axios.get(ENDPOINTS.STUDENT_READINGS.MY_READINGS)
      ]);
      
      console.log('📚 Réponse des assignments:', assignmentsResponse.data);
      console.log('📖 Réponse des lectures:', readingsResponse.data);
      
      // Vérification détaillée des données
      assignmentsResponse.data.forEach(assignment => {
        console.log('📝 Détails de l\'assignment:', {
          id: assignment.id,
          book: assignment.book,
          hasBook: !!assignment.book,
          bookTitle: assignment?.book?.title,
          bookAuthor: assignment?.book?.author
        });
      });

      setAssignments(assignmentsResponse.data);
      setMyReadings(readingsResponse.data);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('🚀 Début de la soumission du résumé');
      console.log('📝 Données à envoyer:', {
        assignment_id: selectedAssignment?.id,
        summary: summary.trim()
      });

      if (!selectedAssignment || !summary.trim()) {
        console.log('❌ Validation échouée:', {
          hasAssignment: !!selectedAssignment,
          hasSummary: !!summary.trim()
        });
        setError('Veuillez sélectionner un devoir et écrire un résumé.');
        return;
      }

      const response = await axios.post(ENDPOINTS.STUDENT_READINGS.CREATE, {
        assignment_id: selectedAssignment.id,
        summary: summary.trim()
      });

      console.log('✅ Réponse du serveur:', response.data);

      setOpenDialog(false);
      setSelectedAssignment(null);
      setSummary('');
      fetchData();
      setError(null);

      // Déclencher l'événement de rafraîchissement du dashboard
      window.dispatchEvent(new Event('readingSubmitted'));

      setSuccessMessage('Résumé soumis avec succès !');
    } catch (error) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      setError('Erreur lors de la soumission du résumé. Veuillez réessayer.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'validated':
        return 'Validé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusé';
      default:
        return status;
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
        mb: 4,
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              '& .MuiAlert-icon': {
                color: theme.palette.error.main
              }
            }}
          >
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              '& .MuiAlert-icon': {
                color: theme.palette.success.main
              }
            }}
          >
            {successMessage}
          </Alert>
        )}

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
            Mes lectures
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Rafraîchir">
              <IconButton 
                onClick={fetchData}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Soumettre un résumé
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {assignments.map((assignment) => {
            const bookTitle = assignment?.book?.title || 'Titre non disponible';
            const bookAuthor = assignment?.book?.author || 'Auteur non disponible';
            const assignedDate = assignment?.assigned_date 
              ? new Date(assignment.assigned_date).toLocaleDateString()
              : 'Date non disponible';
            
            const myReading = myReadings.find(r => r.assignment_id === assignment.id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={assignment.id}>
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
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.primary.main
                      }}
                    >
                      {bookTitle}
                    </Typography>
                    <Typography 
                      color="textSecondary" 
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      Auteur: {bookAuthor}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      Assigné le: {assignedDate}
                    </Typography>
                    
                    {myReading ? (
                      <>
                        <Typography 
                          variant="body2" 
                          sx={{ mb: 2 }}
                        >
                          Résumé soumis le: {new Date(myReading.submitted_at).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={getStatusLabel(myReading.status)}
                          color={getStatusColor(myReading.status)}
                          sx={{ 
                            borderRadius: '20px',
                            fontWeight: 500
                          }}
                        />
                      </>
                    ) : (
                      <Chip
                        label="À faire"
                        color="default"
                        sx={{ 
                          borderRadius: '20px',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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
          Historique des résumés
        </Typography>

        <Grid container spacing={3}>
          {myReadings.map((reading) => (
            <Grid item xs={12} sm={6} md={4} key={reading.id}>
              <Card 
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => {
                  setSelectedReading(reading);
                  setOpenReadingDialog(true);
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main
                    }}
                  >
                    {reading.assignment?.book?.title}
                  </Typography>
                  <Typography 
                    color="textSecondary" 
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    Soumis le: {new Date(reading.submitted_at).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={getStatusLabel(reading.status)}
                    color={getStatusColor(reading.status)}
                    sx={{ 
                      borderRadius: '20px',
                      fontWeight: 500,
                      mb: 2
                    }}
                  />
                  {reading.validated_at && (
                    <Typography 
                      color="textSecondary"
                      sx={{ 
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Validé le: {new Date(reading.validated_at).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            setSummary('');
            setSelectedAssignment(null);
          }}
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
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Soumettre un résumé
            </Typography>
            <IconButton 
              onClick={() => {
                setOpenDialog(false);
                setSummary('');
                setSelectedAssignment(null);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Devoir"
              value={selectedAssignment?.id || ''}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const assignment = assignments.find(a => a.id === selectedId);
                setSelectedAssignment(assignment);
              }}
              margin="normal"
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                mb: 2
              }}
            >
              <option value="">Sélectionner un devoir</option>
              {assignments
                .filter(assignment => !myReadings.some(r => r.assignment_id === assignment.id))
                .map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.book?.title || 'Titre non disponible'}
                  </option>
                ))}
            </TextField>
            
            <TextField
              fullWidth
              label="Résumé"
              multiline
              rows={6}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              margin="normal"
              placeholder="Écrivez votre résumé ici..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                setSummary('');
                setSelectedAssignment(null);
              }}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={!selectedAssignment || !summary.trim()}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              Soumettre
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openReadingDialog}
          onClose={() => setOpenReadingDialog(false)}
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
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Résumé - {selectedReading?.assignment?.book?.title}
            </Typography>
            <IconButton 
              onClick={() => setOpenReadingDialog(false)}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedReading && (
              <Box sx={{ mt: 2 }}>
                <Typography paragraph sx={{ mb: 3 }}>
                  <strong>Date de soumission:</strong> {new Date(selectedReading.submitted_at).toLocaleDateString()}
                </Typography>
                <Typography paragraph sx={{ mb: 3 }}>
                  <strong>Statut:</strong>{' '}
                  <Chip
                    label={getStatusLabel(selectedReading.status)}
                    color={getStatusColor(selectedReading.status)}
                    sx={{ 
                      borderRadius: '20px',
                      fontWeight: 500
                    }}
                  />
                </Typography>
                {selectedReading.validated_at && (
                  <Typography paragraph sx={{ mb: 3 }}>
                    <strong>Validé le:</strong> {new Date(selectedReading.validated_at).toLocaleDateString()}
                  </Typography>
                )}
                <Typography paragraph sx={{ mb: 2 }}>
                  <strong>Résumé:</strong>
                </Typography>
                <Box sx={{ 
                  p: 3, 
                  bgcolor: theme.palette.grey[50], 
                  borderRadius: '12px',
                  maxHeight: '300px',
                  overflow: 'auto',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography>
                    {selectedReading.summary}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenReadingDialog(false)}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Readings;
