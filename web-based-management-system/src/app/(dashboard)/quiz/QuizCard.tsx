"use client";

import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import { Quiz } from '@/types/types';

export const QuizCard = ({ _id, quiz }: { _id: string, quiz: Quiz }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const imageSignature = Math.random().toString(36).substring(7);

  const handleDeleteQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/?_id=${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      window.location.reload();

    } catch (error) {
      console.error('Error deleting quiz:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  
  return (
    <>
        <Card sx={{ minWidth: 275, m: 2, boxShadow: 3, position: 'relative' }}>
        <CardMedia
            component="img"
            height="200"
            src={`https://picsum.photos/seed/${imageSignature}/800/600`}
            alt={`${quiz.title} cover image`}
            sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
            aspectRatio: '16/9',
            width: '100%',
            mb: 2 // Added margin-bottom for spacing
            }}
            loading="lazy"
        />
        <CardContent sx={{ pt: 0 }}> {/* Reduced top padding to control spacing */}
            <Typography variant="h5" component="div" sx={{ mb: 2 }}> {/* Added margin-bottom */}
            {quiz.title}
            </Typography>
            
            {/* Existing content remains the same */}
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {quiz.category} • {quiz.difficulty}
            </Typography>
            <Typography variant="body2" paragraph>
            {quiz.description}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
            Created by: {quiz.author}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
            Created on: {new Date(quiz.creationDate).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
            Questions: {quiz.questions?.length || 0}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => console.log('Edit quiz', _id)}
            >
                Edit
            </Button>
            <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setDeleteDialogOpen(true)}
            >
                Delete
            </Button>
            </Box>
        </CardContent>
        </Card>

        <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Delete Quiz Confirmation
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete the quiz "{quiz.title}"? This action cannot be undone.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
                onClick={handleDeleteQuiz}
                color="error"
                autoFocus
                variant="contained"
            >
                Confirm Delete
            </Button>
            </DialogActions>
        </Dialog>
    </>
  );
};