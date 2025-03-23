"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  InputLabel,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import type { MongoQuiz, Student } from '@/types/types';
import MainGrid from '../components/MainGrid';

interface QuizResult {
  _id: string;
  studentId: string;
  quizId: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
  createdAt: Date;
}

const swiftEpochOffset = 978307200; // Seconds between 1970 and 2001 epochs

function reviver(key: string, value: any): any {
    // Handle MongoDB Extended JSON
    if (value && typeof value === 'object') {
      if ('$numberDouble' in value) {
        const numericValue = parseFloat(value.$numberDouble);
        // Convert Swift dates (seconds since 2001-01-01) to JS Date
        if (key === 'date') {
          const jsTimestamp = (numericValue + 978307200) * 1000;
          return new Date(jsTimestamp);
        }
        return numericValue;
      }
      if ('$oid' in value) return value.$oid;
    }
    return value;
  }

export default function StudentQuizAnalysis() {
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState('');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizzes, setQuizzes]= useState<MongoQuiz[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError('Failed to fetch students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchQuizResults = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/anaysis/student-quiz-result?id=${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch results');
      
      const text = await response.text();
      const data = JSON.parse(text, reviver);
    
      const validatedData = data.map((item: any) => ({
        ...item,
        createdAt: item.date instanceof Date ? item.date : new Date(),
      }));
      
      setQuizResults(validatedData);

      // Extract quiz IDs from the newly fetched data
      const quizIds = validatedData.map((result: QuizResult) => result.quizId);
      
      setQuizLoading(true);
      const quizzesData = await Promise.all(
        quizIds.map(async (quizId: string) => {
          const response = await fetch(`/api/quiz?_id=${quizId}`);
          if (!response.ok) throw new Error(`Failed to fetch quiz ${quizId}`);
          return await response.json();
        })
      );
      setQuizzes(quizzesData);
      setQuizLoading(false);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setQuizLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalQuizzes = quizResults.length;
  const totalQuestions = quizResults.reduce((acc, quiz) => acc + quiz.answers.length, 0);
  const totalCorrect = quizResults.reduce(
    (acc, quiz) => acc + quiz.answers.filter(a => a.isCorrect).length,
    0
  );
  const accuracyRate = ((totalCorrect / totalQuestions) * 100 || 0).toFixed(1);

  const chartData = {
    pie: [
      { id: 0, value: totalCorrect, label: 'Correct' },
      { id: 1, value: totalQuestions - totalCorrect, label: 'Incorrect' },
    ],
    bar: quizResults.map((quiz, index) => ({
      attempt: index + 1,
      correct: quiz.answers.filter(a => a.isCorrect).length,
      total: quiz.answers.length,
      date: quiz.createdAt?.toLocaleDateString('en-US') || 'N/A', // Now using Date directly
    })),
  };

  return (
    
    <div className=' w-full'>
      
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Student Quiz Analysis
        </Typography>    
      <Box sx={{ display: 'flex', gap: 2, mb: 4, minWidth:1200 }}>
        <FormControl fullWidth>
          <InputLabel id="select-student-label">Student</InputLabel>
          <Select
            labelId="select-student-label"
            id="select-box-student"
            value={studentId}
            label="Student"
            onChange={event => setStudentId(event.target.value)}
            fullWidth
            disabled={students.length === 0}
          >
            {
              students.map((student) => (
                <MenuItem key={student._id} value={student._id}>{student.firstName} {student.lastName}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={fetchQuizResults}
          // disabled={loading || !studentId}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Loading...' : 'Analyze'}
        </Button>

        
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {quizResults.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="subtitle2">Total Attempts</Typography>
                  <Typography variant="h4">{totalQuizzes}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="subtitle2">Accuracy Rate</Typography>
                  <Typography variant="h4">{accuracyRate}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="subtitle2">Total Correct</Typography>
                  <Typography variant="h4">{totalCorrect}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="subtitle2">Total Questions</Typography>
                  <Typography variant="h4">{totalQuestions}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ height: '100%', width: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Accuracy Distribution
                  </Typography>
                  <Box sx={{ height: 300}}>
                    <PieChart
                      series={[
                        {
                          data: chartData.pie,
                          innerRadius: 40,
                          paddingAngle: 2,
                          cornerRadius: 4,
                        },
                      ]}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attempt Performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <BarChart
                      xAxis={[
                        {
                          dataKey: 'date',
                          scaleType: 'band',
                          label: 'Attempt Date',
                        },
                      ]}
                      series={[
                        { dataKey: 'correct', label: 'Correct Answers' },
                        { dataKey: 'total', label: 'Total Questions' },
                      ]}
                      dataset={chartData.bar}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Attempt History
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Quiz</TableCell>
                      <TableCell>Total Questions</TableCell>
                      <TableCell>Correct Answers</TableCell>
                      <TableCell>Accuracy</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quizResults.map((quiz, index) => {
                    const correct = quiz.answers.filter(a => a.isCorrect).length;
                    const accuracy = ((correct / quiz.answers.length) * 100).toFixed(1);
                    return (
                        <TableRow key={quiz._id}>
                        <TableCell>
                            {/* Add optional chaining and loading state */}
                            {quizLoading ? 'Loading...' : quizzes[index]?.quiz?.title || 'Quiz title not available'}
                        </TableCell>
                        <TableCell>{quiz.answers.length}</TableCell>
                        <TableCell>{correct}</TableCell>
                        <TableCell>{accuracy}%</TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
        <Divider sx={{ my: 4 }} />
        {/* <MainGrid/> */}
    </div>
  );
}