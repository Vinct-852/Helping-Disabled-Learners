"use client";

import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

type TripCardProps = {
  tripName: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  startDay: string;
  endDay: string;
}

function TripCard({
  tripName,
  location,
  imageUrl,
  description,
  startDay,
  endDay,
}: TripCardProps) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
      {imageUrl ? (
                <CardMedia
                    component="img"
                    height="140"
                    image={imageUrl}
                    alt={tripName}
                />
            ) : (
                <div
                    style={{
                        height: '140px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                </div>
            )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {tripName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {startDay} - {endDay}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
            Share
        </Button>
      </CardActions> */}
    </Card>
  );
}

export default TripCard;
export {  };

