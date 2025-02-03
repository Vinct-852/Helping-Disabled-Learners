import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Radio,
  FormControlLabel,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Question, Option } from'@/types/types';

interface QuestionEditorProps {
  question: Question;
  onSave?: (question: Question) => void;
  onUpdate?: (question: Question) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [editingQuestion, setEditingQuestion] = useState<Question>(question);
  const [newOptionText, setNewOptionText] = useState('');

  const isDialog = !!onSave;

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      const newOption: Option = {
        text: newOptionText.trim()
      };
      setEditingQuestion({
        ...editingQuestion,
        options: [...editingQuestion.options, newOption]
      });
      setNewOptionText('');
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editingQuestion);
    } else if (onUpdate) {
      onUpdate(editingQuestion);
    }
    if (onClose) onClose();
  };

  const content = (
    <Stack spacing={2}>
      <TextField
        label="Question Text"
        value={editingQuestion.question}
        onChange={e => setEditingQuestion({
          ...editingQuestion,
          question: e.target.value
        })}
        fullWidth
        multiline
      />

      <Typography variant="subtitle1">Options:</Typography>
      
      {editingQuestion.options.map((option, index) => (
        <Stack key={index} direction="row" alignItems="center" spacing={1}>
          <FormControlLabel
            control={
              <Radio
                checked={editingQuestion.correctAnswerId === index}
                onChange={() => setEditingQuestion({
                  ...editingQuestion,
                  correctAnswerId: index
                })}
              />
            }
            label={
              <TextField
                value={option.text}
                onChange={e => {
                  const newOptions = [...editingQuestion.options];
                  newOptions[index].text = e.target.value;
                  setEditingQuestion({...editingQuestion, options: newOptions});
                }}
                fullWidth
              />
            }
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            onClick={() => setEditingQuestion({
              ...editingQuestion,
              options: editingQuestion.options.filter((_, i) => i !== index)
            })}
          >
            <Delete />
          </IconButton>
        </Stack>
      ))}

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          value={newOptionText}
          onChange={e => setNewOptionText(e.target.value)}
          label="New Option"
          fullWidth
          onKeyPress={e => e.key === 'Enter' && handleAddOption()}
        />
        <Button
          variant="outlined"
          onClick={handleAddOption}
          startIcon={<Add />}
        >
          Add
        </Button>
      </Stack>
    </Stack>
  );

  return isDialog ? (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{question.question ? 'Edit Question' : 'New Question'}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <div>
      {content}
      <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
        {onDelete && (
          <Button onClick={onDelete} color="error">
            Delete Question
          </Button>
        )}
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </Stack>
    </div>
  );
};