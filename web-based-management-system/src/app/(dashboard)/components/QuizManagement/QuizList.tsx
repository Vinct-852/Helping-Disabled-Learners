import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import { Delete, Edit, Sort, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Quiz } from '@/types/types';

interface QuizListProps {
  quizzes: Quiz[];
  onDelete: (quizId: number) => void;
  onEdit: (quizId: number) => void;
  onSelect: (quizId: number) => void;
}

// Add this type to handle string-based sortable fields
type SortableQuizField = 'title' | 'author' | 'creationDate' | 'difficulty' | 'category';

// Updated component code
const QuizList: React.FC<QuizListProps> = ({ quizzes, onDelete, onEdit, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableQuizField>('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting and filtering logic
  const filteredQuizzes = quizzes
    .filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (sortBy === 'creationDate') {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return modifier * (dateA - dateB);
      }
      
      // Type-safe comparison for string fields
      const aValue = a[sortBy] as string;
      const bValue = b[sortBy] as string;
      return modifier * aValue.localeCompare(bValue);
    });

  // Pagination logic
  const paginatedQuizzes = filteredQuizzes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortableQuizField);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Stack spacing={3}>
        {/* Header and Controls */}
        <Typography variant="h5" component="div">
          Quizzes ({quizzes.length})
        </Typography>

        {/* Search and Sort Controls */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Search Quizzes"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="creationDate">Date</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="difficulty">Difficulty</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Sort direction">
            <IconButton onClick={toggleSortDirection}>
              {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Quiz List */}
        <List>
          {paginatedQuizzes.map((quiz) => (
            <Paper key={quiz.id} elevation={2} sx={{ mb: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onSelect(quiz.id)}
                      >
                        {quiz.title}
                      </Typography>
                      <Chip label={quiz.difficulty} size="small" color="primary" />
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        by {quiz.author} | {new Date(quiz.creationDate).toLocaleDateString()}
                      </Typography>
                      <br />
                      {quiz.description}
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" spacing={1}>
                        <Chip label={`${quiz.questions.length} questions`} size="small" />
                        <Chip label={quiz.category} size="small" variant="outlined" />
                      </Stack>
                    </>
                  }
                />
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Tooltip title="Edit quiz">
                    <IconButton onClick={() => onEdit(quiz.id)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete quiz">
                    <IconButton onClick={() => onDelete(quiz.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
            </Paper>
          ))}
        </List>

        {/* Pagination */}
        {filteredQuizzes.length > itemsPerPage && (
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={Math.ceil(filteredQuizzes.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        )}

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No quizzes found matching your criteria
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default QuizList;