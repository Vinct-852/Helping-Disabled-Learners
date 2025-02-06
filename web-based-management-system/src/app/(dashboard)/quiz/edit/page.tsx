"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  IconButton,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { Quiz, Option, Question, MongoQuiz } from '@/types/types';

interface CreateQuizFormProps {
  immersiveSetCreation: boolean;
  onQuizCreated?: (quiz: MongoQuiz) => void;
}

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({onQuizCreated, immersiveSetCreation}) => {
    const [quizData, setQuizData] = useState<Quiz>({
        title: '',
        description: '',
        author: '',
        creationDate: '8/2/2025',
        category: 'General Knowledge',
        difficulty: 'Easy',
        questions: [
          {
            id: 1,
            question: '',
            options: [{ id: 1, text: '' }, { id: 2, text: '' }],
            correctAnswerId: 1
          }
        ]
      });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedData = {
      quiz: {
        title: quizData.title,
        description: quizData.description,
        author: quizData.author,
        creationDate: quizData.creationDate,
        category: quizData.category,
        difficulty: quizData.difficulty,
        questions: quizData.questions.map(question => ({
          id: question.id,
          question: question.question,
          options: question.options.map(option => ({
            id: option.id,
            text: option.text
          })),
          correctAnswerId: question.correctAnswerId 
        }))
      }
    };

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const createdQuiz = await response.json();
        if (onQuizCreated) {
          onQuizCreated(createdQuiz);
        }
      } else {
        alert('Error creating quiz');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating quiz');
    }
  };

  // Add question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: quizData.questions.length + 1,
      question: '',
      options: [{ id: 1, text: '' }, { id: 2, text: '' }],
      correctAnswerId: 1
    };
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  // Delete question
  const deleteQuestion = (questionIndex: number) => {
    const updatedQuestions = quizData.questions.filter((_, idx) => idx !== questionIndex);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add option
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    const newOptionId = updatedQuestions[questionIndex].options.length + 1;
    updatedQuestions[questionIndex].options.push({ id: newOptionId, text: '' });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Create New Quiz</Typography>

        {/* Basic Information Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={quizData.description}
              onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Author"
              value={quizData.author}
              onChange={(e) => setQuizData({ ...quizData, author: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              value={quizData.category}
              onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={quizData.difficulty}
                label="Difficulty"
                onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Questions Section */}
        {quizData.questions.map((question, qIndex) => (
          <Box key={qIndex} sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            {/* Question Header with Delete Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>Question {qIndex + 1}</Typography>
              <IconButton 
                onClick={() => deleteQuestion(qIndex)} 
                disabled={quizData.questions.length === 1}
                >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <TextField
              fullWidth
              label="Question Text"
              value={question.question}
              onChange={(e) => {
                const updatedQuestions = [...quizData.questions];
                updatedQuestions[qIndex].question = e.target.value;
                setQuizData({ ...quizData, questions: updatedQuestions });
              }}
              required
            />

            {question.options.map((option, oIndex) => (
              <Box key={oIndex} sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label={`Option ${option.id}`}
                  value={option.text}
                  onChange={(e) => {
                    const updatedQuestions = [...quizData.questions];
                    updatedQuestions[qIndex].options[oIndex].text = e.target.value;
                    setQuizData({ ...quizData, questions: updatedQuestions });
                  }}
                  required
                />
                <IconButton
                  onClick={() => {
                    const updatedQuestions = [...quizData.questions];
                    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
                      (_, i) => i !== oIndex
                    );
                    setQuizData({ ...quizData, questions: updatedQuestions });
                  }}
                  disabled={question.options.length <= 2}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={() => addOption(qIndex)}
              sx={{ mt: 1 }}
              disabled={question.options.length >= 4}
            >
              Add Option
            </Button>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Correct Answer</InputLabel>
              <Select
                value={question.correctAnswerId}
                label="Correct Answer"
                onChange={(e) => {
                  const updatedQuestions = [...quizData.questions];
                  updatedQuestions[qIndex].correctAnswerId = Number(e.target.value);
                  setQuizData({ ...quizData, questions: updatedQuestions });
                }}
                required
              >
                {question.options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    Option {option.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={addQuestion}
          sx={{ mt: 3 }}
          disabled={quizData.questions.length >= 10}
        >
          Add Question
        </Button>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {immersiveSetCreation?(
            <Button type="submit" variant="contained" size="large">
              Create Immersive Set
            </Button>
          ):(
            <Button type="submit" variant="contained" size="large">
              Create Quiz
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CreateQuizForm;