import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import AppTheme from '../shared-theme/AppTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import NavBar from '@/app/components/NavBar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppRouterCacheProvider>
          <AppTheme>
            <CssBaseline enableColorScheme/>
            <NavBar/>
            <div style={{ flexGrow: 1, marginTop: '100px' }}> {/* Add margin here */}
              <Container maxWidth="lg">
                <Box
                  sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {children}
                </Box>
              </Container>
            </div>
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
