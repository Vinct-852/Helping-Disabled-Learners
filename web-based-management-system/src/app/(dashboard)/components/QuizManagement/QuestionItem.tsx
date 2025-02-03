import React, { useState } from 'react';
import { Button, TextField, Stack, Typography, IconButton, Card, CardContent } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Option, Question } from '@/types/types';

interface QuestionItemProps {
  question?: Question;
  index?: number;
  onUpdate?: (question: Question) => void;
  onDelete?: () => void;
  onSave?: (question: Question) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ 
  question: initialQuestion, 
  index, 
  onUpdate, 
  onDelete,
  onSave 
}) => {
  const [questionText, setQuestionText] = useState(initialQuestion?.question || '');
  const [options, setOptions] = useState<Option[]>(
    initialQuestion?.options || [
      {text: '' },
    ]
  );
  const [correctAnswer, setCorrectAnswer] = useState(initialQuestion?.correctAnswerId || 0);
  const [isEditing, setIsEditing] = useState(!initialQuestion);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {  
        text: ''       
      }
    ]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = {text: value};
    setOptions(newOptions);
  };

  const handleSave = () => {
    const newQuestion: Question = {
      question: questionText,
      options: options,
      correctAnswerId: correctAnswer
    };
    
    if (onSave) {
      onSave(newQuestion);
    } else if (onUpdate) {
      onUpdate(newQuestion);
      setIsEditing(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {isEditing ? (
          <Stack spacing={2}>
            <TextField
              label="Question Text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              fullWidth
            />
            
            {options.map((option, i) => (
              <TextField
                key={i}
                label={`Option ${i + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                fullWidth
              />
            ))}
            
            <Button onClick={handleAddOption}>Add Option</Button>
            
            <TextField
              label="Correct Answer Index"
              type="number"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
              inputProps={{ min: 0, max: options.length - 1 }}
            />
            
            <Button variant="contained" onClick={handleSave}>
              Save Question
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1}>
            <Typography variant="subtitle1">
              {index !== undefined ? `Question ${index + 1}: ` : ''}{initialQuestion?.question}
            </Typography>
            {initialQuestion?.options.map((option, i) => (
              <Typography 
                key={i} 
                sx={{ 
                  color: i === initialQuestion.correctAnswerId ? 'success.main' : 'inherit',
                  fontWeight: i === initialQuestion.correctAnswerId ? 'bold' : 'normal'
                }}
              >
                {option.text}
              </Typography>
            ))}
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onDelete} color="error">
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};