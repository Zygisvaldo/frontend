import React, { useState, useContext } from 'react';
import { Movie } from '../types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteConfirmationDialog from './DeleteConfirmationDialog '
import { deleteMovieById, updateMovieById } from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import EditMovieDialog from './EditMovieDialog';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

  const { isAuthenticated } = useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMovieById(movie.id);
      navigate('/movies');
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
    setDialogOpen(false);
  };

  const handleConfirmEdit = async (editedMovie: Movie) => {
    console.log('Edited movie:', editedMovie);
    try {
      await updateMovieById(editedMovie.id, editedMovie);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
    setEditDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditDialogOpen(false);
  };

  return (
    <div>
      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
      {isAuthenticated && (
        <Stack spacing={2} direction="row" sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="outlined" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      )}
      <DeleteConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirmDelete={handleConfirmDelete}
      />
      <EditMovieDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        movie={movie}
        onSave={(editedMovie) => {
          handleConfirmEdit(editedMovie)
        }}
      />
    </div>
  );
};

export default MovieCard;
