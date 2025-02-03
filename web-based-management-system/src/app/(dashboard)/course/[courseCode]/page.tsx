"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack, Chip, Divider } from '@mui/material';
import { Course } from '@/types/types';
import ImmersiveSetCard from '../ImmersiveSetCard'; // Import the component

export default function CourseDetailPage() {
  const { courseCode } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course?courseCode=${courseCode}`);
        if (!response.ok) throw new Error('Course not found');
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseCode]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!course) return <Typography>Course not found</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      {/* Header Section */}
      <Stack spacing={2}>
        <Button 
          variant="outlined" 
          onClick={() => router.push('/course')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to Courses
        </Button>
        <Typography variant="h3">{course.courseTitle}</Typography>

        {/* Course Metadata */}
        <Stack direction="row" spacing={1}>
          <Chip label={`Course Code: ${course.courseCode}`} />
          <Chip label={`Instructor ID: ${course.teacherId}`} />
        </Stack>

        {/* Course Description */}
        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>
      </Stack>

      <Divider />

      {/* Immersive Sets Section */}
      <Stack spacing={3}>
        <Typography variant="h4" component="h2">
          Immersive Sets ({course.immersiveSets.length})
        </Typography>

        {course.immersiveSets.map((set) => (
          <ImmersiveSetCard
            id={set._id}
          />
        ))}

        {course.immersiveSets.length === 0 && (
          <Typography color="text.secondary">
            No immersive sets available for this course
          </Typography>
        )}
      </Stack>
    </Box>
  );
}