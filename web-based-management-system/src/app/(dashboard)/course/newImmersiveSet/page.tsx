"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import CreateQuizForm from '../../quiz/edit/CreateQuizForm';

const ImmersiveSetCreateContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const courseCode = searchParams.get('courseCode');

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
  const [newQuiz, setNewQuiz] = useState<MongoQuiz | null>(null);
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

  const handleQuizCreated = (newQuiz: MongoQuiz) => {
    setNewQuiz(newQuiz);
    setQuizOption('new');
    handleSubmit(newQuiz._id); // Submit the immersive set after quiz creation
  };

  const handleSubmit = async (quiz_id?: string) => {
    formData.video_url = "https://www.youtube.com/embed/"+formData.video_url;
    const finalSet: ImmersiveSet = {
      ...formData,
      _id: '', 
      quiz: quizOption === 'existing' ? selectedQuiz : quiz_id,
    } as ImmersiveSet;

    try {
      const response = await fetch('/api/immersiveSet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSet)
      });
      
      if (!response.ok) throw new Error('Failed to create immersive set');

      const createdImmersiveSet = await response.json();
      const secondFetchBody = {
        immersiveSetId: createdImmersiveSet.id
      };
      const response2 = await fetch(`/api/course/${courseId}/immersive-set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(secondFetchBody)
      });

      if (!response2) throw new Error('Submission failed');

      alert('Immersive set created successfully!'); 
      window.location.href = `/course/${courseCode}`;

    } catch (error) {
      console.error('Error creating immersive set:', error);
    }
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
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleSubmit()} 
                >
                    Create Immersive Set
                </Button>
            </Box>
        </Box>
        ) : (
        <Stack spacing={2}>
            <CreateQuizForm 
              immersiveSetCreation
              onQuizCreated={handleQuizCreated} 
            />
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
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : null}
        </Box>

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

const ImmersiveSetCreate = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImmersiveSetCreateContent />
    </Suspense>
  );
};

export default ImmersiveSetCreate;