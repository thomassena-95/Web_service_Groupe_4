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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Classrooms = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [newClassroom, setNewClassroom] = useState({ name: '' });
  const [error, setError] = useState('');
  const theme = useTheme();
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [editingClassroomName, setEditingClassroomName] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms');
      // Pour chaque classe, récupérer le nombre d'étudiants
      const classroomsWithStudents = await Promise.all(
        response.data.map(async (classroom) => {
          const studentsResponse = await axios.get(`/api/classrooms/${classroom.id}/students`);
          return {
            ...classroom,
            students: studentsResponse.data
          };
        })
      );
      setClassrooms(classroomsWithStudents);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      setError('Erreur lors de la récupération des classes');
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get('/api/users', {
        params: {
          role: 'student'
        }
      });
      
      // Vérifier si selectedClassroom et students existent
      const currentStudents = selectedClassroom?.students || [];
      
      // Filtrer les étudiants qui ne sont pas déjà dans la classe
      const availableStudents = response.data.filter(
        student => !currentStudents.some(s => s.id === student.id)
      );
      
      setAvailableStudents(availableStudents);
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      setError('Erreur lors de la récupération des étudiants');
    }
  };

  const handleCreateClassroom = async () => {
    try {
      if (!newClassroom.name.trim()) {
        setError('Le nom de la classe ne peut pas être vide');
        return;
      }

      await axios.post('/api/classrooms', newClassroom);
      setOpenDialog(false);
      setNewClassroom({ name: '' });
      setError('');
      fetchClassrooms();
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création de la classe');
    }
  };

  const handleUpdateClassroom = async (id, newName) => {
    try {
      await axios.put(`/api/classrooms/${id}`, { name: newName });
      setOpenEditDialog(false);
      setEditingClassroom(null);
      fetchClassrooms();
    } catch (error) {
      console.error('Erreur lors de la modification de la classe:', error);
      setError('Erreur lors de la modification de la classe');
    }
  };

  const handleDeleteClassroom = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        await axios.delete(`/api/classrooms/${id}`);
        fetchClassrooms();
      } catch (error) {
        console.error('Erreur lors de la suppression de la classe:', error);
        setError('Erreur lors de la suppression de la classe');
      }
    }
  };

  const handleViewStudents = async (classroom) => {
    try {
      // Récupérer les détails complets de la classe, y compris les étudiants
      const response = await axios.get(`/api/classrooms/${classroom.id}/students`);
      console.log('Étudiants récupérés:', response.data);
      
      setSelectedClassroom({
        ...classroom,
        students: response.data
      });
      setOpenStudentsDialog(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      setError('Erreur lors de la récupération des étudiants');
    }
  };

  const handleAddStudent = async (classroomId) => {
    try {
      if (!selectedStudent) {
        setError('Veuillez sélectionner un étudiant');
        return;
      }

      console.log('Ajout de l\'étudiant:', selectedStudent, 'à la classe:', classroomId);

      const response = await axios.post(`/api/classrooms/${classroomId}/students`, {
        student_id: selectedStudent
      });
      
      console.log('Réponse du serveur:', response.data);
      
      // Mettre à jour la liste des classes
      await fetchClassrooms();
      
      // Mettre à jour la classe sélectionnée
      if (selectedClassroom?.id === classroomId) {
        const studentsResponse = await axios.get(`/api/classrooms/${classroomId}/students`);
        setSelectedClassroom(prev => ({
          ...prev,
          students: studentsResponse.data
        }));
      }
      
      setOpenAddStudentDialog(false);
      setSelectedStudent('');
      setError('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
      setError(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'étudiant');
    }
  };

  const handleRemoveStudent = async (classroomId, studentId) => {
    try {
      console.log('Suppression de l\'étudiant:', studentId, 'de la classe:', classroomId);
      
      const response = await axios.delete(`/api/classrooms/${classroomId}/students/${studentId}`);
      console.log('Réponse du serveur:', response.data);

      // Mettre à jour la liste des classes
      await fetchClassrooms();
      
      // Mettre à jour la classe sélectionnée
      if (selectedClassroom?.id === classroomId) {
        const studentsResponse = await axios.get(`/api/classrooms/${classroomId}/students`);
        setSelectedClassroom(prev => ({
          ...prev,
          students: studentsResponse.data
        }));
      }
      
      setError('');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étudiant:', error);
      setError(error.response?.data?.error || 'Erreur lors de la suppression de l\'étudiant');
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('🔄 Début de la récupération des étudiants...');
      const response = await axios.get('/api/users/students');
      console.log('✅ Réponse reçue:', response.data);
      setAvailableStudents(response.data);
      setError('');
    } catch (error) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError('Erreur lors de la récupération des étudiants');
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
            Mes Classes
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
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
            Créer une classe
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4} key={classroom.id}>
              <Card sx={{
                height: '100%',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  '& .classroom-actions': {
                    opacity: 1
                  }
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
                        {classroom.name}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2
                      }}>
                        <PeopleIcon sx={{ 
                          color: theme.palette.primary.main,
                          fontSize: '1.2rem'
                        }} />
                        <Typography 
                          color="textSecondary"
                          sx={{ 
                            fontSize: '0.9rem',
                            fontWeight: 500
                          }}
                        >
                          {classroom.students?.length || 0} étudiants
                        </Typography>
                      </Box>
                    </Box>
                    <Box 
                      className="classroom-actions"
                      sx={{ 
                        display: 'flex',
                        gap: 1,
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity 0.2s ease',
                        '& .MuiIconButton-root': {
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }
                      }}
                    >
                      <Tooltip title="Voir les étudiants">
                        <IconButton 
                          onClick={() => handleViewStudents(classroom)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light + '20'
                            }
                          }}
                        >
                          <PeopleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          onClick={() => {
                            setEditingClassroom(classroom);
                            setOpenEditDialog(true);
                          }}
                          sx={{ 
                            color: theme.palette.info.main,
                            '&:hover': {
                              backgroundColor: theme.palette.info.light + '20'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          onClick={() => handleDeleteClassroom(classroom.id)}
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
          ))}
        </Grid>

        {/* Dialog pour créer une classe */}
        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            setError('');
            setNewClassroom({ name: '' });
          }}
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
            Créer une nouvelle classe
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la classe"
              fullWidth
              value={newClassroom.name}
              onChange={(e) => setNewClassroom({ name: e.target.value })}
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                setError('');
                setNewClassroom({ name: '' });
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
              onClick={handleCreateClassroom}
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
              Créer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour voir les étudiants */}
        <Dialog
          open={openStudentsDialog}
          onClose={() => setOpenStudentsDialog(false)}
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
            Étudiants - {selectedClassroom?.name}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => {
                  fetchStudents();
                  setOpenAddStudentDialog(true);
                }}
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
                Ajouter un étudiant
              </Button>
            </Box>
            <List sx={{ 
              '& .MuiListItem-root': {
                borderRadius: '8px',
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }
            }}>
              {selectedClassroom?.students?.map((student) => (
                <ListItem key={student.id}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 500 }}>
                        {student.first_name} {student.last_name}
                      </Typography>
                    }
                    secondary={student.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir retirer cet étudiant de la classe ?')) {
                          handleRemoveStudent(selectedClassroom.id, student.id);
                        }
                      }}
                      sx={{ 
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: theme.palette.error.light + '20'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setOpenStudentsDialog(false)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour ajouter un étudiant */}
        <Dialog
          open={openAddStudentDialog}
          onClose={() => {
            setOpenAddStudentDialog(false);
            setSelectedStudent('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Ajouter un étudiant à {selectedClassroom?.name}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Étudiant</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                label="Étudiant"
              >
                {availableStudents.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} ({student.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenAddStudentDialog(false);
                setSelectedStudent('');
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={() => handleAddStudent(selectedClassroom.id)}
              color="primary"
              variant="contained"
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour modifier une classe */}
        <Dialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setEditingClassroom(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Modifier la classe
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la classe"
              fullWidth
              value={editingClassroom?.name || ''}
              onChange={(e) => setEditingClassroom(prev => ({
                ...prev,
                name: e.target.value
              }))}
              error={!!error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenEditDialog(false);
                setEditingClassroom(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={() => handleUpdateClassroom(editingClassroom.id, editingClassroom.name)}
              color="primary"
              variant="contained"
            >
              Modifier
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Classrooms;
