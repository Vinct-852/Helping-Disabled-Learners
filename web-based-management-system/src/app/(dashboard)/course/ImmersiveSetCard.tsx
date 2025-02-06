"use client";

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
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
  IconButtonProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ImmersiveSet, MongoQuiz } from '@/types/types';
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
  }, [immersiveSet.quiz]); // Add quiz ID as dependency

  if (loading) return <Typography>Loading quiz...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ maxWidth: 1200, margin: '2rem auto', p: 2 }}>
      <CardHeader
        title={immersiveSet.title}
        titleTypographyProps={{ variant: 'h6', component: 'h1' }}
        sx={{ pb: 0 }}
        action={
          <IconButton aria-label="settings" sx={{ ml: 2 }}>
            <MoreVertIcon />
          </IconButton>
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

        <Divider />

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
                <List sx={{ mt: 3 }}>
                  {mongoQuiz.quiz.questions.map((question, index) => (
                    <React.Fragment key={question.question}>
                      <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${index + 1}. ${question.question}`}
                        primaryTypographyProps={{ component: "div" }}
                        secondary={
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            {question.options.map((option, optIndex) => (
                              <Typography 
                                key={optIndex}
                                component="div" // Change from default <p> to <div>
                                variant="body2"
                                sx={{
                                  p: 1,
                                  bgcolor: optIndex === question.correctAnswerId 
                                    ? 'success.light' 
                                    : 'background.paper',
                                  borderRadius: 1,
                                  color: optIndex === question.correctAnswerId ? 'white' : 'inherit'
                                }}
                              >
                                {option.text}
                              </Typography>
                            ))}
                          </Stack>
                        }
                        secondaryTypographyProps={{ component: "div" }}
                      />
                      </ListItem>
                      {index < mongoQuiz.quiz.questions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </>
          )}  
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImmersiveSetCard;
