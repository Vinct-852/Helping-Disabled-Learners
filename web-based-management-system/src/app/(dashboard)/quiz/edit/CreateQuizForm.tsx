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
  FormHelperText,
  Divider,
  Paper,
  Slider,
  Rating,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete'; 
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { 
  Quiz, 
  Question, 
  MongoQuiz, 
  QuestionType, 
  MultipleChoiceQuestion,
  MatchingQuestion,
  OrderingQuestion,
  LikertScaleQuestion,
  MatchingPair,
  OrderingItem,
  ScaleLabel,
  Option
} from '@/types/types';

interface CreateQuizFormProps {
  immersiveSetCreation: boolean;
  onQuizCreated?: (quiz: MongoQuiz) => void;
}

// Define initial quiz data outside the component to ensure it's consistent
const initialQuizData: Quiz = {
  title: '',
  description: '',
  author: '',
  creationDate: '2025-02-08', // Use a fixed date format instead of dynamic date
  category: 'General Knowledge',
  difficulty: 'Easy',
  questions: [
    {
      id: 1,
      type: 'multipleChoice',
      question: '',
      options: [{ id: 1, text: '' }, { id: 2, text: '' }],
      correctAnswerId: 1
    }
  ]
};

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({
  onQuizCreated, 
  immersiveSetCreation = false
}) => {
  // Use the predefined initial state
  const [quizData, setQuizData] = useState<Quiz>(initialQuizData);

  // Load the component only on the client side to avoid hydration issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quiz: quizData }),
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

  // Add question with specified type
  const addQuestion = (type: QuestionType) => {
    let newQuestion: Question;
    const nextId = quizData.questions.length + 1;

    switch (type) {
      case 'multipleChoice':
        newQuestion = {
          id: nextId,
          type: 'multipleChoice',
          question: '',
          options: [{ id: 1, text: '' }, { id: 2, text: '' }],
          correctAnswerId: 1
        } as MultipleChoiceQuestion;
        break;
      
      case 'matching':
        newQuestion = {
          id: nextId,
          type: 'matching',
          question: '',
          pairs: [
            { id: 1, left: '', right: '' },
            { id: 2, left: '', right: '' }
          ],
          correctPairs: [
            { leftId: 1, rightId: 1 },
            { leftId: 2, rightId: 2 }
          ]
        } as MatchingQuestion;
        break;
      
      case 'ordering':
        newQuestion = {
          id: nextId,
          type: 'ordering',
          question: '',
          items: [
            { id: 1, text: '' },
            { id: 2, text: '' }
          ],
          correctOrder: [1, 2]
        } as OrderingQuestion;
        break;
      
      case 'likertScale':
        newQuestion = {
          id: nextId,
          type: 'likertScale',
          question: '',
          statement: '',
          scalePoints: 5,
          scaleLabels: [
            { value: 1, label: 'Strongly Disagree' },
            { value: 2, label: 'Disagree' },
            { value: 3, label: 'Neutral' },
            { value: 4, label: 'Agree' },
            { value: 5, label: 'Strongly Agree' }
          ],
          feedback: {
            "1": "",
            "2": "",
            "3": "",
            "4": "",
            "5": ""
          }
        } as LikertScaleQuestion;
        break;
      
      default:
        return;
    }
    
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  // Delete question
  const deleteQuestion = (questionIndex: number) => {
    const updatedQuestions = quizData.questions.filter((_, idx) => idx !== questionIndex);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add option for multiple choice questions
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[questionIndex] as MultipleChoiceQuestion;
    
    if (question.type !== 'multipleChoice') return;
    
    const newOptionId = question.options.length + 1;
    question.options.push({ id: newOptionId, text: '' });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add pair for matching questions
  const addPair = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[questionIndex] as MatchingQuestion;
    
    if (question.type !== 'matching') return;
    
    const newPairId = question.pairs.length + 1;
    question.pairs.push({ id: newPairId, left: '', right: '' });
    question.correctPairs.push({ leftId: newPairId, rightId: newPairId });
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add item for ordering questions
  const addOrderItem = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[questionIndex] as OrderingQuestion;
    
    if (question.type !== 'ordering') return;
    
    const newItemId = question.items.length + 1;
    question.items.push({ id: newItemId, text: '' });
    question.correctOrder.push(newItemId);
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Update scale points for Likert scale questions
  const updateScalePoints = (questionIndex: number, points: number) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[questionIndex] as LikertScaleQuestion;
    
    if (question.type !== 'likertScale') return;
    
    // Default labels for different scale points
    const defaultLabels = {
      3: [
        { value: 1, label: 'Disagree' },
        { value: 2, label: 'Neutral' },
        { value: 3, label: 'Agree' }
      ],
      5: [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' }
      ],
      7: [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Somewhat Disagree' },
        { value: 4, label: 'Neutral' },
        { value: 5, label: 'Somewhat Agree' },
        { value: 6, label: 'Agree' },
        { value: 7, label: 'Strongly Agree' }
      ]
    };
    
    // Create a new feedback object with the right number of points
    const newFeedback: Record<string, string> = {};
    for (let i = 1; i <= points; i++) {
      newFeedback[i.toString()] = question.feedback?.[i.toString()] || '';
    }
    
    question.scalePoints = points;
    question.scaleLabels = defaultLabels[points as keyof typeof defaultLabels] || [];
    question.feedback = newFeedback;
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Render different question types
  const renderQuestionFields = (question: Question, qIndex: number) => {
    switch (question.type) {
      case 'multipleChoice':
        return renderMultipleChoiceFields(question as MultipleChoiceQuestion, qIndex);
      case 'matching':
        return renderMatchingFields(question as MatchingQuestion, qIndex);
      case 'ordering':
        return renderOrderingFields(question as OrderingQuestion, qIndex);
      case 'likertScale':
        return renderLikertScaleFields(question as LikertScaleQuestion, qIndex);
      default:
        return null;
    }
  };

  // Render multiple choice question fields
  const renderMultipleChoiceFields = (question: MultipleChoiceQuestion, qIndex: number) => (
    <>
      {question.options.map((option, oIndex) => (
        <Box key={oIndex} sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label={`Option ${option.id}`}
            value={option.text}
            onChange={(e) => {
              const updatedQuestions = [...quizData.questions];
              (updatedQuestions[qIndex] as MultipleChoiceQuestion).options[oIndex].text = e.target.value;
              setQuizData({ ...quizData, questions: updatedQuestions });
            }}
            required
          />
          <IconButton
            onClick={() => {
              const updatedQuestions = [...quizData.questions];
              const mcQuestion = updatedQuestions[qIndex] as MultipleChoiceQuestion;
              mcQuestion.options = mcQuestion.options.filter((_, i) => i !== oIndex);
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
        disabled={question.options.length >= 6}
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
            (updatedQuestions[qIndex] as MultipleChoiceQuestion).correctAnswerId = Number(e.target.value);
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
    </>
  );

  // Render matching question fields
  const renderMatchingFields = (question: MatchingQuestion, qIndex: number) => (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Matching Pairs</Typography>
      
      {question.pairs.map((pair, pIndex) => (
        <Box key={pIndex} sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Left Item"
            value={pair.left}
            onChange={(e) => {
              const updatedQuestions = [...quizData.questions];
              (updatedQuestions[qIndex] as MatchingQuestion).pairs[pIndex].left = e.target.value;
              setQuizData({ ...quizData, questions: updatedQuestions });
            }}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            label="Right Item"
            value={pair.right}
            onChange={(e) => {
              const updatedQuestions = [...quizData.questions];
              (updatedQuestions[qIndex] as MatchingQuestion).pairs[pIndex].right = e.target.value;
              setQuizData({ ...quizData, questions: updatedQuestions });
            }}
            required
            sx={{ flex: 1 }}
          />
          <IconButton
            onClick={() => {
              const updatedQuestions = [...quizData.questions];
              const matchingQuestion = updatedQuestions[qIndex] as MatchingQuestion;
              
              // Remove the pair
              matchingQuestion.pairs = matchingQuestion.pairs.filter((_, i) => i !== pIndex);
              
              // Remove corresponding correctPair entry
              matchingQuestion.correctPairs = matchingQuestion.correctPairs.filter(
                cp => cp.leftId !== pair.id
              );
              
              setQuizData({ ...quizData, questions: updatedQuestions });
            }}
            disabled={question.pairs.length <= 2}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => addPair(qIndex)}
        sx={{ mt: 1 }}
        disabled={question.pairs.length >= 6}
      >
        Add Pair
      </Button>
    </>
  );

  // Render ordering question fields
  const renderOrderingFields = (question: OrderingQuestion, qIndex: number) => (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Items to Order</Typography>
      
      {question.items.map((item, iIndex) => (
        <Box key={iIndex} sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <DragIndicatorIcon color="action" />
          <TextField
            fullWidth
            label={`Item ${item.id}`}
            value={item.text}
            onChange={(e) => {
              const updatedQuestions = [...quizData.questions];
              (updatedQuestions[qIndex] as OrderingQuestion).items[iIndex].text = e.target.value;
              setQuizData({ ...quizData, questions: updatedQuestions });
            }}
            required
          />
          <IconButton
            onClick={() => {
              const updatedQuestions = [...quizData.questions];
              const orderingQuestion = updatedQuestions[qIndex] as OrderingQuestion;
              
              // Remove the item
              const itemId = orderingQuestion.items[iIndex].id;
              orderingQuestion.items = orderingQuestion.items.filter((_, i) => i !== iIndex);
              
              // Remove from correctOrder
              orderingQuestion.correctOrder = orderingQuestion.correctOrder.filter(id => id !== itemId);
              
              setQuizData({ ...quizData, questions: updatedQuestions });
            }}
            disabled={question.items.length <= 2}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => addOrderItem(qIndex)}
        sx={{ mt: 1 }}
        disabled={question.items.length >= 6}
      >
        Add Item
      </Button>

      <Typography variant="subtitle1" sx={{ mt: 3 }}>Correct Order (Drag to reorder)</Typography>
      <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Set the correct order by entering the item numbers separated by commas (e.g., 3,1,4,2)
        </Typography>
        <TextField
          fullWidth
          label="Correct Order"
          value={question.correctOrder.join(',')}
          onChange={(e) => {
            const updatedQuestions = [...quizData.questions];
            const orderQuestion = updatedQuestions[qIndex] as OrderingQuestion;
            
            // Parse the comma-separated values into an array of numbers
            const orderInput = e.target.value.split(',').map(val => {
              const num = parseInt(val.trim(), 10);
              return isNaN(num) ? 0 : num;
            }).filter(num => num > 0);
            
            // Only update if all values are valid item IDs
            const validIds = orderQuestion.items.map(item => item.id);
            const allValid = orderInput.every(id => validIds.includes(id));
            
            if (allValid) {
              orderQuestion.correctOrder = orderInput;
              setQuizData({ ...quizData, questions: updatedQuestions });
            }
          }}
          helperText="Enter the item numbers in the correct order"
        />
      </Paper>
    </>
  );

  // Render Likert scale question fields
  const renderLikertScaleFields = (question: LikertScaleQuestion, qIndex: number) => (
    <>
      <TextField
        fullWidth
        label="Statement to Rate"
        value={question.statement}
        onChange={(e) => {
          const updatedQuestions = [...quizData.questions];
          (updatedQuestions[qIndex] as LikertScaleQuestion).statement = e.target.value;
          setQuizData({ ...quizData, questions: updatedQuestions });
        }}
        required
        sx={{ mt: 2 }}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Scale Points</Typography>
        <FormControl fullWidth>
          <Select
            value={question.scalePoints}
            onChange={(e) => updateScalePoints(qIndex, Number(e.target.value))}
          >
            <MenuItem value={3}>3-Point Scale</MenuItem>
            <MenuItem value={5}>5-Point Scale</MenuItem>
            <MenuItem value={7}>7-Point Scale</MenuItem>
          </Select>
          <FormHelperText>Select the number of points on the scale</FormHelperText>
        </FormControl>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Scale Labels</Typography>
        {question.scaleLabels.map((label, lIndex) => (
          <Box key={lIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ width: 80 }}>Point {label.value}:</Typography>
            <TextField
              fullWidth
              value={label.label}
              onChange={(e) => {
                const updatedQuestions = [...quizData.questions];
                const likertQuestion = updatedQuestions[qIndex] as LikertScaleQuestion;
                likertQuestion.scaleLabels[lIndex].label = e.target.value;
                setQuizData({ ...quizData, questions: updatedQuestions });
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Feedback (Optional)</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add optional feedback for each rating point
        </Typography>
        
        {Object.keys(question.feedback || {}).map((key) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ width: 80 }}>Point {key}:</Typography>
            <TextField
              fullWidth
              placeholder={`Feedback for rating ${key}`}
              value={question.feedback?.[key] || ''}
              onChange={(e) => {
                const updatedQuestions = [...quizData.questions];
                const likertQuestion = updatedQuestions[qIndex] as LikertScaleQuestion;
                if (!likertQuestion.feedback) likertQuestion.feedback = {};
                likertQuestion.feedback[key] = e.target.value;
                setQuizData({ ...quizData, questions: updatedQuestions });
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );

  // Return loading state until client-side hydration is complete
  if (!isClient) {
    return <Typography>Loading form...</Typography>;
  }

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
            {/* Question Header with Delete Button and Type Selector */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>Question {qIndex + 1}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={question.type}
                    label="Question Type"
                    onChange={(e) => {
                      // When changing question type, replace the entire question with a new one of the selected type
                      const newType = e.target.value as QuestionType;
                      const updatedQuestions = [...quizData.questions];
                      
                      // Create a new question of the selected type
                      let newQuestion: Question;
                      
                      switch (newType) {
                        case 'multipleChoice':
                          newQuestion = {
                            id: question.id,
                            type: 'multipleChoice',
                            question: question.question,
                            options: [{ id: 1, text: '' }, { id: 2, text: '' }],
                            correctAnswerId: 1
                          } as MultipleChoiceQuestion;
                          break;
                        
                        case 'matching':
                          newQuestion = {
                            id: question.id,
                            type: 'matching',
                            question: question.question,
                            pairs: [
                              { id: 1, left: '', right: '' },
                              { id: 2, left: '', right: '' }
                            ],
                            correctPairs: [
                              { leftId: 1, rightId: 1 },
                              { leftId: 2, rightId: 2 }
                            ]
                          } as MatchingQuestion;
                          break;
                        
                        case 'ordering':
                          newQuestion = {
                            id: question.id,
                            type: 'ordering',
                            question: question.question,
                            items: [
                              { id: 1, text: '' },
                              { id: 2, text: '' }
                            ],
                            correctOrder: [1, 2]
                          } as OrderingQuestion;
                          break;
                        
                        case 'likertScale':
                          newQuestion = {
                            id: question.id,
                            type: 'likertScale',
                            question: question.question,
                            statement: '',
                            scalePoints: 5,
                            scaleLabels: [
                              { value: 1, label: 'Strongly Disagree' },
                              { value: 2, label: 'Disagree' },
                              { value: 3, label: 'Neutral' },
                              { value: 4, label: 'Agree' },
                              { value: 5, label: 'Strongly Agree' }
                            ],
                            feedback: {
                              "1": "",
                              "2": "",
                              "3": "",
                              "4": "",
                              "5": ""
                            }
                          } as LikertScaleQuestion;
                          break;
                        
                        default:
                          return;
                      }
                      
                      updatedQuestions[qIndex] = newQuestion;
                      setQuizData({ ...quizData, questions: updatedQuestions });
                    }}
                  >
                    <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                    <MenuItem value="matching">Matching</MenuItem>
                    <MenuItem value="ordering">Ordering</MenuItem>
                    <MenuItem value="likertScale">Likert Scale</MenuItem>
                  </Select>
                </FormControl>
                <IconButton 
                  onClick={() => deleteQuestion(qIndex)} 
                  disabled={quizData.questions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
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
              sx={{ mt: 2 }}
            />
            
            {/* Render fields specific to the question type */}
            {renderQuestionFields(question, qIndex)}
          </Box>
        ))}

        {/* Add Question Buttons */}
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addQuestion('multipleChoice')}
            disabled={quizData.questions.length >= 20}
          >
            Add Multiple Choice
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addQuestion('matching')}
            disabled={quizData.questions.length >= 20}
          >
            Add Matching
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addQuestion('ordering')}
            disabled={quizData.questions.length >= 20}
          >
            Add Ordering
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addQuestion('likertScale')}
            disabled={quizData.questions.length >= 20}
          >
            Add Likert Scale
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {immersiveSetCreation ? (
            <Button type="submit" variant="contained" size="large">
              Create Immersive Set
            </Button>
          ) : (
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