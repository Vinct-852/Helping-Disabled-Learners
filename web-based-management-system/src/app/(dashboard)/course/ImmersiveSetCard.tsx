"use client";

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Divider,
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ImmersiveSet, Quiz } from '@/types/types';

interface ImmersiveSetProps {
  id: string; // Changed to accept ID instead of full data
}

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
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  border: 'none'
});

const ImmersiveSetCard: React.FC<ImmersiveSetProps> = ({ id }) => {
  const [data, setData] = useState<ImmersiveSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/immersiveSet?_id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" my={4}>
        {error}
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography align="center" my={4}>
        No immersive set found
      </Typography>
    );
  }

  const { title, videoUrl, topics, quiz } = data;

  return (
    <Card sx={{ maxWidth: 1200, margin: '2rem auto', p: 2 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'h4', component: 'h1' }}
        sx={{ pb: 0 }}
      />

      <CardContent>
        <VideoContainer>
          <StyledIframe
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>

        {topics && topics.length > 0 && (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Covered Topics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {topics.map((topic, index) => (
                <Chip key={index} label={topic} color="primary" variant="outlined" />
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {quiz && (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Quiz Details
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => console.log('Start quiz')}
              >
                Start Quiz
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImmersiveSetCard;