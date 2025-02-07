"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack, Chip, Divider, CircularProgress, Grid, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Course, ImmersiveSet, Student } from '@/types/types';
import ImmersiveSetCard from '../ImmersiveSetCard'; // Import the component
import StudentList from '@/app/(dashboard)/course/StudentList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CourseDetailPage = () => {
  const router = useRouter();
  const { courseCode } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [immersiveSets, setImmersiveSets] = useState<ImmersiveSet[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const handleAddSet = () => {
    router.push(`/course/newImmersiveSet?courseId=${course?._id}&courseCode=${courseCode}`);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course?courseCode=${courseCode}`);
        if (!response.ok) throw new Error('Course not found');
        const data = await response.json();
        setCourse(data);

        if (data.immersiveSets.length > 0) {
          // Extract IDs correctly from MongoDB ObjectId format
          const ids = data.immersiveSets.join(',');
          const setsResponse = await fetch(`/api/immersiveSet?ids=${ids}`);
          const setsDetails = await setsResponse.json();
          setImmersiveSets(setsDetails);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseCode]);

  useEffect(() => {
    if (course?._id) {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`/api/students?courseID=${course._id}`);
          const data = await response.json();
          setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
          setError('Failed to fetch students');
        }
      };

      fetchStudents();
    }
  }, [course]);

  useEffect(() => {
    if (error) {
      setErrorDialogOpen(true);
    } else {
      setErrorDialogOpen(false);
    }
  }, [error]);

  const deleteStudent = async (studentID:string) => {
    try {
      const response = await fetch(`/api/students/${studentID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseID: course?._id }),
      });
      if (response.ok) {
        const fetchStudents = async () => {
          try {
            const response = await fetch(`/api/students?courseID=${course?._id}`);
            const data = await response.json();
            setStudents(Array.isArray(data) ? data : []);
          } catch (error) {
            setError('Failed to fetch students');
          }
        };

        fetchStudents();
      } else {
        setError('Failed to delete student');
      }
    } catch (error) {
      setError('Failed to delete student');
    }
  };

  const handleAddStudent = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseID: course?._id }),
      });

      if (response.ok) {
        // Fetch the updated list of students
        const fetchStudents = async () => {
          try {
            const response = await fetch(`/api/students?courseID=${course?._id}`);
            const data = await response.json();
            setStudents(Array.isArray(data) ? data : []);
          } catch (error) {
            setError('Failed to fetch students');
            setErrorDialogOpen(true);
          }
        };

        fetchStudents();
        setOpen(false);
        setStudentId('');
      } else {
        setError('Failed to add course to student');
        setErrorDialogOpen(true);
      }
    } catch (error) {
      setError('Failed to add course to student');
      setErrorDialogOpen(true);
    }
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
    setError(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
  <DialogTitle>Error</DialogTitle>
  <DialogContent>
    <DialogContentText>
      {error}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleErrorDialogClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>;
  if (!course) return <Typography>Course not found</Typography>;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      {/* Header Section */}
      <Stack spacing={2}>
        <Typography variant="h1">{course.courseTitle}</Typography>

        {/* Course Metadata */}
        <Stack direction="row" spacing={1}>
          <Chip label={`Course Code: ${course.courseCode}`} />
        </Stack>

        {/* Course Description */}
        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>
      </Stack>

      <Divider />

      {/* Student List Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="student-list-content"
          id="student-list-header"
        >
          <Typography variant="h6">Student List</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StudentList students={students} deleteStudent={deleteStudent} addStudent={handleAddStudent} />
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Immersive Sets Section */}
      <Stack spacing={0.3}>
        <Typography variant="h5" component="h2">
          Immersive Sets
        </Typography>
        
        <Button
            variant="contained"
            onClick={handleAddSet}
            sx={{ mb: 3 }}
          >
            Add New Immersive Set
        </Button>

        <Grid container spacing={5}>
          {immersiveSets.map((set) => (
            <ImmersiveSetCard
              key={set._id} 
              immersiveSet={set} 
            />
          ))}
        </Grid>

        {immersiveSets.length === 0 && (
          <Typography color="text.secondary">
            No immersive sets available for this course
          </Typography>
        )}
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the student ID to add the student to the course.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Student ID"
            type="text"
            fullWidth
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetailPage;
