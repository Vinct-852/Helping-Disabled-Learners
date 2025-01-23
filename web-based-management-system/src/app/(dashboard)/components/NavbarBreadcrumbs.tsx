"use client";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

interface NavbarBreadcrumbsProps {
  links?: string[]; // Array of breadcrumb items
}

export default function NavbarBreadcrumbs({ links }: NavbarBreadcrumbsProps) {
  if (!links || links.length === 0) {
    return <Typography variant="body1"></Typography>; 
  }

  return (
    <StyledBreadcrumbs aria-label="breadcrumb">
      {links.map((item, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={index === links.length - 1 ? { color: 'text.primary', fontWeight: 600 } : {}}
        >
          {item}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
