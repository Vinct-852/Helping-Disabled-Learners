import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Stack, 
  Divider,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { QuestionEditor } from '../QuizManagement/QuestionEditor';
import { Question, Quiz } from'@/types/types';

interface QuizFormProps {
  quiz: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSave, onCancel }) => {
  const [formState, setFormState] = useState<Quiz>(quiz);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h5">
          {quiz.id ? 'Edit Quiz' : 'Create New Quiz'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Quiz Title"
              value={formState.title}
              onChange={e => setFormState({...formState, title: e.target.value})}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Author"
              value={formState.author}
              onChange={e => setFormState({...formState, author: e.target.value})}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <TextField
          label="Description"
          value={formState.description}
          onChange={e => setFormState({...formState, description: e.target.value})}
          multiline
          rows={3}
          fullWidth
        />

        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formState.category}
                label="Category"
                onChange={e => setFormState({...formState, category: e.target.value})}
              >
                <MenuItem value="General Knowledge">General Knowledge</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Literature">Literature</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={formState.difficulty}
                label="Difficulty"
                onChange={e => setFormState({...formState, difficulty: e.target.value})}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider />

        <Typography variant="h6">Questions</Typography>

        {formState.questions.map((question, index) => (
          <QuestionEditor
            question={question}
            onUpdate={updatedQuestion => {
              const newQuestions = [...formState.questions];
              newQuestions[index] = updatedQuestion;
              setFormState({...formState, questions: newQuestions});
            }}
            onDelete={() => setFormState({
              ...formState,
              questions: formState.questions.filter((_, i) => i !== index)
            })}
          />
        ))}

        <Button 
          variant="outlined" 
          onClick={() => setCurrentQuestion({
            question: '',
            options: [],
            correctAnswerId: 0
          })}
        >
          Add Question
        </Button>

        <Divider />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="primary">
            Save Quiz
          </Button>
        </Stack>
      </Stack>

      {/* Question Editor Dialog */}
      {currentQuestion && (
        <QuestionEditor
          question={currentQuestion}
          onSave={newQuestion => {
            setFormState({
              ...formState,
              questions: [...formState.questions, newQuestion]
            });
            setCurrentQuestion(null);
          }}
          onClose={() => setCurrentQuestion(null)}
        />
      )}
    </form>
  );
};