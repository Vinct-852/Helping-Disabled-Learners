import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

export default function Home() {
  return (
    <div>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Material UI - Next.js App Router example in TypeScript
      </Typography>
      <Link href="/about" color="secondary" component={NextLink}>
        Go to the about page
      </Link>
    </div>
  );
}