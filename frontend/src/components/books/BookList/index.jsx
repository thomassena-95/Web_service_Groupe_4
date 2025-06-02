import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const BookList = ({ books }) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      width: '100%',
      animation: 'fadeIn 0.5s ease-in',
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 }
      }
    }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 3
        }}
      >
        Liste de livres
      </Typography>
      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '& .MuiTableHead-root': {
            backgroundColor: theme.palette.primary.main + '10',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Id</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Auteur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow 
                key={book.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transition: 'background-color 0.2s ease'
                  }
                }}
              >
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookList;