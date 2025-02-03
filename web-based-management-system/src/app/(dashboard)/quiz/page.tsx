"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Button, Typography, Box, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { QuizCard } from './QuizCard';
import { MongoQuiz } from '@/types/types';
import Header from '../components/Header';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<MongoQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quiz');
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data: MongoQuiz[] = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAddQuiz = () => {
    router.push('/quiz/edit'); // Navigate to the /quiz/edit route
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
            Quizzes
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddQuiz}
            sx={{ mb: 3 }}
          >
            Add New Quiz
          </Button>

          <Grid container spacing={3}>
            {quizzes.map((mongoQuiz) => (
              <Grid item key={mongoQuiz._id} xs={12} sm={6} md={4}>
                <QuizCard _id={mongoQuiz._id} quiz={mongoQuiz.quiz} />
              </Grid>
            ))}
          </Grid>

          {quizzes.length === 0 && (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              No quizzes available. Click the "Add New Quiz" button to create one.
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
