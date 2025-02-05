"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack, Chip, Divider, CircularProgress, Grid } from '@mui/material';
import { Course, ImmersiveSet } from '@/types/types';
import ImmersiveSetCard from '../ImmersiveSetCard'; // Import the component

export default function CourseDetailPage() {
  const router = useRouter();
  const { courseCode } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [immersiveSets, setImmersiveSets] = useState<ImmersiveSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAddSet = () => {
    router.push(`/course/newImmersiveSet?courseId=${course?._id}`);
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
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
    </Box>
  );
}
