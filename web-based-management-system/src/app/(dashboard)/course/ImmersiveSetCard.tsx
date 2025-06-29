"use client";

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Divider,
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
  Collapse,
  CardActions,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ImmersiveSet, 
  MongoQuiz, 
  Question, 
  MultipleChoiceQuestion,
  MatchingQuestion,
  OrderingQuestion,
  LikertScaleQuestion,
  MatchingPair,
  OrderingItem,
  ScaleLabel,
  Option 
} from '@/types/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ImmersiveSetProps {
  immersiveSet: ImmersiveSet;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  paddingTop: '56.25%',
  // minHeight: '400px',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3), 
}));

const StyledIframe = styled('iframe')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none'
});

const ImmersiveSetCard: React.FC<ImmersiveSetProps> = ({ immersiveSet }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [mongoQuiz, setQuiz] = useState<MongoQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = async () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/immersiveSet?_id=${immersiveSet._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete immersive set');
      
      setDeleteDialogOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete immersive set');
      setDeleteDialogOpen(false);
    }
  };

  const handleDuplicate = () => {
    handleMenuClose();
    console.log('Duplicate immersive set:', immersiveSet._id);
    alert(`Duplicate action triggered for ${immersiveSet.title}`);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!immersiveSet.quiz) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/quiz?_id=${immersiveSet.quiz}`);
        if (!response.ok) throw new Error('Failed to fetch quiz');
        const data: MongoQuiz = await response.json();
        setQuiz(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [immersiveSet.quiz]);

  if (loading) return <Typography>Loading quiz...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ maxWidth: 1200, margin: '2rem auto', p: 2 }}>
      <CardHeader
        title={immersiveSet.title}
        titleTypographyProps={{ variant: 'h6', component: 'h1' }}
        sx={{ pb: 0 }}
        action={
          <>
            <IconButton 
              aria-label="settings" 
              sx={{ ml: 2 }}
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
          </>
        }
      />
      
      <CardContent sx={{ mt: 2 }}>
        <VideoContainer>
          <StyledIframe
            src={immersiveSet.video_url}
            title={immersiveSet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>

        {immersiveSet.topics && immersiveSet.topics?.length > 0 && (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {immersiveSet.topics.map((topic, index) => (
                <Chip key={index} label={topic} color="primary" variant="outlined" />
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        <Box sx={{ p: 2 }}>
          {mongoQuiz && (
            <>
              <Typography variant="h5" gutterBottom>
                <strong>{mongoQuiz.quiz.title}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {mongoQuiz.quiz.description}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={mongoQuiz.quiz.category} color="primary" variant="outlined" size="small" />
                <Chip label={mongoQuiz.quiz.difficulty} color="primary" variant="outlined" size="small" />
              </Stack>

              <CardActions disableSpacing>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                {mongoQuiz.quiz.questions && (
                  <List sx={{ mt: 3 }}>
                    {mongoQuiz.quiz.questions.map((question, index) => (
                      <React.Fragment key={question.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`${index + 1}. ${question.question}`}
                            primaryTypographyProps={{ component: "div" }}
                            secondary={
                              <Stack spacing={1} sx={{ mt: 1 }}>
                                {(!question.type || question.type === 'multipleChoice') && (question as MultipleChoiceQuestion).options?.map((option: Option, optIndex: number) => (
                                  <Typography 
                                    key={optIndex}
                                    component="div"
                                    variant="body2"
                                    sx={{
                                      p: 1,
                                      bgcolor: optIndex === (question as MultipleChoiceQuestion).correctAnswerId-1 
                                        ? 'success.light' 
                                        : 'background.paper',
                                      borderRadius: 1,
                                      color: optIndex === (question as MultipleChoiceQuestion).correctAnswerId-1 ? 'white' : 'inherit'
                                    }}
                                  >
                                    {option.text}
                                  </Typography>
                                ))}
                                
                                {question.type === 'matching' && (question as MatchingQuestion).pairs?.map((pair: MatchingPair, pairIndex: number) => (
                                  <Box 
                                    key={pair.id}
                                    sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      p: 1,
                                      mb: 1,
                                      bgcolor: 'background.paper',
                                      borderRadius: 1
                                    }}
                                  >
                                    <Typography>{pair.left}</Typography>
                                    <Typography>→</Typography>
                                    <Typography>{pair.right}</Typography>
                                  </Box>
                                ))}

                                {question.type === 'ordering' && (
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Correct Order:</Typography>
                                    {(question as OrderingQuestion).correctOrder?.map((itemId: number, index: number) => {
                                      const item = (question as OrderingQuestion).items?.find((i: OrderingItem) => i.id === itemId);
                                      return item && (
                                        <Typography
                                          key={itemId}
                                          sx={{
                                            p: 1,
                                            mb: 0.5,
                                            bgcolor: 'background.paper',
                                            borderRadius: 1
                                          }}
                                        >
                                          {index + 1}. {item.text}
                                        </Typography>
                                      );
                                    })}
                                  </Box>
                                )}

                                {question.type === 'likertScale' && (
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{(question as LikertScaleQuestion).statement}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                      {(question as LikertScaleQuestion).scaleLabels?.map((label: ScaleLabel) => (
                                        <Typography
                                          key={label.value}
                                          variant="body2"
                                          sx={{
                                            textAlign: 'center',
                                            maxWidth: '100px'
                                          }}
                                        >
                                          {label.label}
                                        </Typography>
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                              </Stack>
                            }
                            secondaryTypographyProps={{ component: "div" }}
                          />
                        </ListItem>
                        {index < (mongoQuiz.quiz.questions.length - 1) && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Collapse>
            </>
          )}  
        </Box>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete "{immersiveSet.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
      </CardContent>
    </Card>
  );
};

export default ImmersiveSetCard;