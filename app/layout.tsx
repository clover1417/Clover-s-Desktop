import './styles/config.css';
import './styles/global.css';
import './styles/animations.css';

import './styles/background.css';
import './styles/desktopWindow.css';

import './styles/Components/volumeSlider.css';
import './styles/Components/taskbar.css';
import './styles/Components/widgets.css';
import './styles/Components/quickAccess.css';
import './styles/Components/modal.css';
import './styles/Components/tooltip.css';
import './styles/Components/imageViewer.css';
import './styles/Components/windows.css';
import './styles/Widgets/musicPlayer.css';

import './styles/Applications/about.css';
import './styles/Applications/gallery.css';
import './styles/Applications/stuff.css';
import './styles/Applications/works.css';
import './styles/Applications/wiki.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import { Itim, Pixelify_Sans } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const itim = Itim({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-itim",
});

const pixelifySans = Pixelify_Sans({
  weight: ['400', '500', '600'],
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
});

export const metadata: Metadata = {
  title: "Clover's Portfolio",
  description: 'Portfolio website with a unique desktop-inspired design',
  keywords: ['portfolio', 'web development', 'design', 'next.js'],
  authors: [{ name: 'Clover' }],
  creator: 'Clover',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${itim.variable} ${pixelifySans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
