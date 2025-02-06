"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Button, Typography, Box, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { CourseCard } from './CourseCard';
import { Course } from '@/types/types';
import Header from '../components/Header';

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/course');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    router.push('/course/edit');
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex' }}>
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: 3,
          pb: 5,
          mt: { xs: 8, md: 0 },
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Courses
          </Typography>

          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCourse}
            sx={{ mb: 3 }}
          >
            Add New Course
          </Button> */}

          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item key={course._id} xs={12} sm={6} md={4}>
                <CourseCard 
                  _id={course._id}
                  course={course}
                />
              </Grid>
            ))}
          </Grid>

          {courses.length === 0 && (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              No courses available. Click the "Add New Course" button to create one.
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}