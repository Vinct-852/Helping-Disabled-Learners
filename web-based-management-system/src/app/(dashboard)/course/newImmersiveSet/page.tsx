"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
  DialogContentText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { ImmersiveSet, MongoQuiz, Quiz } from '@/types/types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateQuizForm from '../../quiz/edit/page';

interface ImmersiveSetCreateProps {
  courseId: string;
}

const ImmersiveSetCreate: React.FC<ImmersiveSetCreateProps> = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ImmersiveSet>>({
    title: '',
    video_url: '',
    topics: [],
    videoType: 'youtube'
  });
  const [quizOption, setQuizOption] = useState<'existing' | 'new'>('existing');
  const [existingQuizzes, setExistingQuizzes] = useState<MongoQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [newQuiz, setNewQuiz] = useState<Quiz | null>(null);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [missingFieldsDialogOpen, setMissingFieldsDialogOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const steps = ['Set Basic Information', 'Add Quiz'];

  const handleNext = () => {
    if (activeStep === 0) {
      const missing = [];
      if (!formData.title?.trim()) missing.push("Title");
      if (!formData.video_url?.trim()) missing.push(
        formData.videoType === 'upload' ? "Video File" : "YouTube URL"
      );
  
      if (missing.length > 0) {
        setMissingFields(missing);
        setMissingFieldsDialogOpen(true);
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };
  
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuizOptionChange = (event: SelectChangeEvent) => {
    setQuizOption(event.target.value as 'existing' | 'new');
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quiz');
        const data = await response.json();
        setExistingQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
  
    if (quizOption === 'existing') {
      fetchQuizzes();
    }
  }, [quizOption]);

  const handleSubmit = async () => {
    const finalSet: ImmersiveSet = {
      ...formData,
      _id: '', // MongoDB will generate this
      quiz: quizOption === 'existing' ? { _id: selectedQuiz } : newQuiz,
      course: courseId
    } as ImmersiveSet;
    
    console.log(finalSet);
    // try {
    //   const response = await fetch('/api/immersive-sets', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(finalSet)
    //   });
    //   if (!response.ok) throw new Error('Submission failed');
    //   // Handle success
    // } catch (error) {
    //   console.error('Error creating immersive set:', error);
    // }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
            />

            {/* Video Input Selection */}
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    value={formData.videoType || 'youtube'}
                    onChange={(e) => setFormData({ ...formData, videoType: e.target.value as 'youtube' | 'upload' })}
                >
                    <FormControlLabel value="youtube" control={<Radio />} label="YouTube URL" />
                    <FormControlLabel value="upload" control={<Radio />} label="Upload Video" />
                </RadioGroup>
            </FormControl>
        
            {formData.videoType === 'youtube' ? (
            <TextField
                label="YouTube Video URL"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    https://www.youtube.com/embed/
                    </InputAdornment>
                ),
                }}
            />
            ) : (
            <Box>
                <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                >
                Upload Video File
                <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setFormData({
                        ...formData,
                        videoFile: file,
                        video_url: URL.createObjectURL(file)
                        });
                    }
                    }}
                />
                </Button>
                {formData.videoFile && (
                <Typography variant="caption" sx={{ ml: 2 }}>
                    Selected file: {formData.videoFile.name}
                </Typography>
                )}
            </Box>
            )}

            <TextField
            label="Topics"
            value={topicInput} // New state for input control
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                e.preventDefault();
                if (topicInput.trim()) {
                    setFormData(prev => ({
                    ...prev,
                    topics: [...(prev.topics || []), topicInput.trim()]
                    }));
                    setTopicInput(''); // Clear input after adding
                }
                }
            }}
            InputProps={{
                startAdornment: (
                <>
                    {formData.topics?.map((topic, index) => (
                    <Chip
                        key={index}
                        label={topic}
                        sx={{ mr: 1 }}
                        onDelete={() => {
                        const newTopics = [...(formData.topics || [])];
                        newTopics.splice(index, 1);
                        setFormData({ ...formData, topics: newTopics });
                        }}
                    />
                    ))}
                </>
                ),
            }}
            helperText="Press Enter to add topics"
            fullWidth
            />
        </Box>
      )}

    {activeStep === 1 && (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl component="fieldset">
        <RadioGroup
            value={quizOption}
            onChange={handleQuizOptionChange}
            sx={{ gap: 2 }}
        >
            <FormControlLabel 
            value="existing" 
            control={<Radio />} 
            label="Select Existing Quiz" 
            />
            <FormControlLabel 
            value="new" 
            control={<Radio />} 
            label="Create New Quiz" 
            />
        </RadioGroup>
        </FormControl>

        {quizOption === 'existing' ? (
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <TableContainer component={Paper}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: '#1976d2'}}>
                <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Questions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {existingQuizzes.map((quiz) => (
                    <TableRow
                    key={quiz._id}
                    hover
                    selected={selectedQuiz === quiz._id}
                    onClick={() => setSelectedQuiz(quiz._id)}
                    sx={{ cursor: 'pointer' }}
                    >
                    <TableCell padding="checkbox">
                        <Radio 
                        checked={selectedQuiz === quiz._id}
                        onChange={() => setSelectedQuiz(quiz._id)}
                        />
                    </TableCell>
                    <TableCell>{quiz.quiz.title}</TableCell>
                    <TableCell>{quiz.quiz.category}</TableCell>
                    <TableCell>{quiz.quiz.difficulty}</TableCell>
                    <TableCell>{quiz.quiz.questions.length}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            {existingQuizzes.length === 0 && (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                No existing quizzes found
            </Typography>
            )}
        </Box>
        ) : (
        <Stack spacing={2}>
            <CreateQuizForm/>
            {newQuiz && (
            <Paper sx={{ p: 2, mt: 1 }}>
                <Typography variant="subtitle2">Selected Quiz:</Typography>
                <Typography>{newQuiz.title}</Typography>
                <Typography variant="caption">
                {newQuiz.questions.length} questions · {newQuiz.difficulty}
                </Typography>
            </Paper>
            )}
        </Stack>
        )}
    </Box>
    )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" onClick={handleSubmit}>
            Finish
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>

      {/* <QuizCreateDialog
        open={openQuizDialog}
        onClose={() => setOpenQuizDialog(false)}
        onSave={(quiz) => {
          setNewQuiz(quiz);
          setOpenQuizDialog(false);
        }}
      /> */}
        <Dialog
            open={missingFieldsDialogOpen}
            onClose={() => setMissingFieldsDialogOpen(false)}
            >
            <DialogTitle>Missing Information</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Please fill in the following required fields: {missingFields.join(' and ')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setMissingFieldsDialogOpen(false)} autoFocus>
                OK
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

// Example Quiz Creation Dialog (simplified)
const QuizCreateDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (quiz: Quiz) => void;
}> = ({ open, onClose, onSave }) => {
  const [quizData, setQuizData] = useState<Partial<Quiz>>({});

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Quiz</DialogTitle>
      <DialogContent>
        {/* Add quiz creation form elements here */}
        <TextField
          label="Quiz Title"
          fullWidth
          sx={{ mt: 2 }}
          value={quizData.title}
          onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => quizData.title && onSave(quizData as Quiz)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImmersiveSetCreate;