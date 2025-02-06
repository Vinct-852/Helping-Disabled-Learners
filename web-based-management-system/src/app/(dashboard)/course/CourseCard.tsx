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

import { useRouter } from 'next/navigation';

import { Course } from '@/types/types';

export const CourseCard = ({ _id, course }: { _id: string; course: Course }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const imageSignature = Math.random().toString(36).substring(7);

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`/api/course/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Handle successful deletion (e.g., refresh course list or show notification)
      console.log('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ cursor: 'pointer', height: '100%' }}
      >
        <CardMedia
          component="img"
          height="200"
          src={`https://picsum.photos/seed/${imageSignature}/800/600`}
          alt={`${course.courseTitle} cover image`}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
            aspectRatio: '16/9',
            width: '100%',
            mb: 2,
          }}
          loading="lazy"
        />
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="h5" component="div" sx={{ mb: 2 }}>
            {course.courseTitle}
          </Typography>

          <Typography variant="body2" paragraph>
            {course.description}
          </Typography>
          <Typography 
            variant="caption" 
            component="p"  // Changed to p element
            display="block" 
            color="text.secondary" 
            sx={{ mb: 2 }}
          >
            Immersive Sets: {course.immersiveSets?.length || 0}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => router.push(`/course/${course.courseCode}`)}
            >
              View
            </Button>
            {/* <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button> */}
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
          Delete Course Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the course "{course.courseTitle}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteCourse}
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