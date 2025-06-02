import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [books, setBooks] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    book_id: '',
    classroom_id: '',
    assigned_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState({});
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [selectedAssignmentSubmissions, setSelectedAssignmentSubmissions] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, booksRes, classroomsRes] = await Promise.all([
        axios.get('/api/assignments'),
        axios.get('/api/books'),
        axios.get('/api/classrooms'),
      ]);

      console.log('📅 Données brutes des assignments:', assignmentsRes.data);
      
      // Log des dates pour chaque assignment
      assignmentsRes.data.forEach(assignment => {
        console.log('📆 Détails des dates pour assignment:', {
          id: assignment.id,
          assigned_date: assignment.assigned_date,
          due_date: assignment.due_date,
          assigned_date_parsed: new Date(assignment.assigned_date),
          due_date_parsed: new Date(assignment.due_date)
        });
      });

      setAssignments(assignmentsRes.data);
      setBooks(booksRes.data);
      setClassrooms(classroomsRes.data);
      setError('');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données:', error);
      setError('Erreur lors de la récupération des données');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      if (!newAssignment.book_id || !newAssignment.classroom_id) {
        setError('Veuillez sélectionner un livre et une classe');
        return;
      }

      if (!newAssignment.assigned_date || !newAssignment.due_date) {
        setError('Veuillez sélectionner les dates d\'assignation et de rendu');
        return;
      }

      // Vérifier que la date de rendu est après la date d'assignation
      if (new Date(newAssignment.due_date) < new Date(newAssignment.assigned_date)) {
        setError('La date de rendu doit être postérieure à la date d\'assignation');
        return;
      }

      await axios.post('/api/assignments', newAssignment);
      setOpenDialog(false);
      setNewAssignment({
        book_id: '',
        classroom_id: '',
        assigned_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
      });
      setError('');
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la création du devoir:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création du devoir');
    }
  };

  const handleUpdateAssignment = async (id, updatedAssignment) => {
    try {
      // Vérification des données
      if (!updatedAssignment.book_id || !updatedAssignment.classroom_id) {
        setError('Veuillez sélectionner un livre et une classe');
        return;
      }

      if (!updatedAssignment.assigned_date || !updatedAssignment.due_date) {
        setError('Veuillez sélectionner les dates d\'assignation et de rendu');
        return;
      }

      // Vérifier que la date de rendu est après la date d'assignation
      if (new Date(updatedAssignment.due_date) < new Date(updatedAssignment.assigned_date)) {
        setError('La date de rendu doit être postérieure à la date d\'assignation');
        return;
      }

      // Utiliser PATCH au lieu de PUT
      await axios.patch(`/api/assignments/${id}`, updatedAssignment);
      
      setOpenDialog(false);
      setSelectedAssignment(null);
      setNewAssignment({
        book_id: '',
        classroom_id: '',
        assigned_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
      });
      setError('');
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la modification du devoir:', error);
      setError(error.response?.data?.message || 'Erreur lors de la modification du devoir');
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
      try {
        await axios.delete(`/api/assignments/${id}`);
        fetchData();
      } catch (error) {
        console.error('Erreur lors de la suppression du devoir:', error);
        setError('Erreur lors de la suppression du devoir');
      }
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setNewAssignment({
      book_id: assignment.book_id,
      classroom_id: assignment.classroom_id,
      assigned_date: assignment.assigned_date ? new Date(assignment.assigned_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await axios.get(`/api/assignments/${assignmentId}/submissions`);
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des soumissions:', error);
      setError('Erreur lors de la récupération des soumissions');
    }
  };

  const handleValidateSubmission = async (submissionId) => {
    try {
      await axios.patch(`/api/student-readings/${submissionId}/validate`);
      // Rafraîchir les soumissions
      fetchSubmissions(selectedAssignment.id);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setError('Erreur lors de la validation de la soumission');
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    try {
      await axios.patch(`/api/student-readings/${submissionId}/reject`);
      // Rafraîchir les soumissions
      fetchSubmissions(selectedAssignment.id);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      setError('Erreur lors du rejet de la soumission');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ 
        mt: 4, 
        mb: 4,
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography 
            variant="h4" 
            component="h1"
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
            Devoirs de Lecture
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedAssignment(null);
              setNewAssignment({
                book_id: '',
                classroom_id: '',
                assigned_date: new Date().toISOString().split('T')[0],
                due_date: new Date().toISOString().split('T')[0],
              });
              setOpenDialog(true);
            }}
            sx={{
              borderRadius: '12px',
              padding: '10px 24px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}
          >
            Créer un devoir
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {assignments.map((assignment) => {
            const book = books.find(b => b.id === assignment.book_id);
            const classroom = classrooms.find(c => c.id === assignment.classroom_id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                <Card sx={{
                  height: '100%',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: theme.palette.primary.main,
                    borderTopLeftRadius: '16px',
                    borderBottomLeftRadius: '16px'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Box>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary
                          }}
                        >
                          {book?.title}
                        </Typography>
                        <Typography 
                          color="textSecondary" 
                          gutterBottom
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: '0.9rem'
                          }}
                        >
                          <SchoolIcon sx={{ fontSize: '1rem' }} />
                          {classroom?.name}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          mt: 2
                        }}>
                          <Typography 
                            color="textSecondary"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              fontSize: '0.9rem'
                            }}
                          >
                            <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                            Assigné le: {new Date(assignment.assigned_date).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography 
                            color="textSecondary"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              fontSize: '0.9rem'
                            }}
                          >
                            <EventIcon sx={{ fontSize: '1rem' }} />
                            À rendre le: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('fr-FR') : 'Non défini'}
                          </Typography>
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
                        <Tooltip title="Modifier">
                          <IconButton 
                            onClick={() => handleEdit(assignment)}
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light + '20'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            sx={{ 
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light + '20'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            setError('');
            setNewAssignment({
              book_id: '',
              classroom_id: '',
              assigned_date: new Date().toISOString().split('T')[0],
              due_date: new Date().toISOString().split('T')[0],
            });
          }}
          maxWidth="sm"
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
            {selectedAssignment ? 'Modifier le devoir' : 'Créer un nouveau devoir'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Livre</InputLabel>
              <Select
                value={newAssignment.book_id}
                onChange={(e) => setNewAssignment({ ...newAssignment, book_id: e.target.value })}
                label="Livre"
                required
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Classe</InputLabel>
              <Select
                value={newAssignment.classroom_id}
                onChange={(e) => setNewAssignment({ ...newAssignment, classroom_id: e.target.value })}
                label="Classe"
                required
              >
                {classrooms.map((classroom) => (
                  <MenuItem key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Date d'assignation"
              type="date"
              fullWidth
              value={newAssignment.assigned_date}
              onChange={(e) => setNewAssignment({ ...newAssignment, assigned_date: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              margin="dense"
              label="Date limite"
              type="date"
              fullWidth
              value={newAssignment.due_date}
              onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                setError('');
                setNewAssignment({
                  book_id: '',
                  classroom_id: '',
                  assigned_date: new Date().toISOString().split('T')[0],
                  due_date: new Date().toISOString().split('T')[0],
                });
              }}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={selectedAssignment ? 
                () => handleUpdateAssignment(selectedAssignment.id, newAssignment) : 
                handleCreateAssignment
              }
              color="primary"
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
              {selectedAssignment ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSubmissionsDialog}
          onClose={() => setOpenSubmissionsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Soumissions des étudiants
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {selectedAssignmentSubmissions.map((submission) => (
                <Grid item xs={12} key={submission.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {submission.student.first_name} {submission.student.last_name}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            Soumis le: {new Date(submission.submitted_at).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            Statut: {submission.status}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Résumé:
                            </Typography>
                            <Typography>
                              {submission.summary}
                            </Typography>
                          </Box>
                        </Box>
                        {submission.status === 'en_attente' && (
                          <Box>
                            <Tooltip title="Valider">
                              <IconButton 
                                onClick={() => handleValidateSubmission(submission.id)}
                                color="success"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rejeter">
                              <IconButton 
                                onClick={() => handleRejectSubmission(submission.id)}
                                color="error"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSubmissionsDialog(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Assignments;
