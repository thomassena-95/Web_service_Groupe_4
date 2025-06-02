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
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
  });
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération des livres:', error);
      setError('Erreur lors de la récupération des livres');
    }
  };

  const handleCreateBook = async () => {
    try {
      if (!newBook.title.trim() || !newBook.author.trim()) {
        setError('Le titre et l\'auteur sont requis');
        return;
      }

      await axios.post('/api/books', newBook);
      setOpenDialog(false);
      setNewBook({
        title: '',
        author: '',
      });
      setError('');
      fetchBooks();
    } catch (error) {
      console.error('Erreur lors de la création du livre:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création du livre');
    }
  };

  const handleUpdateBook = async (id, updatedBook) => {
    try {
      await axios.put(`/api/books/${id}`, updatedBook);
      fetchBooks();
    } catch (error) {
      console.error('Erreur lors de la modification du livre:', error);
      setError('Erreur lors de la modification du livre');
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ? Cette action supprimera également tous les devoirs associés à ce livre.')) {
      try {
        await axios.delete(`/api/books/${id}`);
        fetchBooks();
        setError('');
      } catch (error) {
        console.error('Erreur lors de la suppression du livre:', error);
        setError(error.response?.data?.error || 'Erreur lors de la suppression du livre');
      }
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
    });
    setOpenDialog(true);
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
            Bibliothèque
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedBook(null);
              setNewBook({
                title: '',
                author: '',
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
            Ajouter un livre
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
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
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}>
                        <MenuBookIcon 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: '2rem'
                          }} 
                        />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary
                          }}
                        >
                          {book.title}
                        </Typography>
                      </Box>
                      <Typography 
                        color="textSecondary"
                        sx={{ 
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        Auteur: {book.author}
                      </Typography>
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
                          onClick={() => handleEdit(book)}
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
                          onClick={() => handleDeleteBook(book.id)}
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

        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            setError('');
            setNewBook({
              title: '',
              author: '',
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
            {selectedBook ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Titre"
              fullWidth
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
            <TextField
              margin="dense"
              label="Auteur"
              fullWidth
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
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
                setNewBook({
                  title: '',
                  author: '',
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
              onClick={selectedBook ? 
                () => handleUpdateBook(selectedBook.id, newBook) : 
                handleCreateBook
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
              {selectedBook ? 'Modifier' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Books;
