import type { Viewport } from 'next';
import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google';

import { METADATA_BASE } from '@/lib/constants/site';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Icons } from '@/components/common/icons';
import { ThemeProvider } from '@/components/config/theme-provider';
import { ThemeSwitcher } from '@/components/config/theme-switcher';
import BaseLayout from '@/components/layouts/base';
import ContainerLayout from '@/components/layouts/container';

import '@/styles/globals.css';

/* -------------------------------- METADATA -------------------------------- */
export const metadata = METADATA_BASE;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

/* ---------------------------------- FONTS --------------------------------- */
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

/* ---------------------------------- ROOT ---------------------------------- */
/**
 * @notice The root layout for the entire application
 */
const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background flex min-h-screen flex-col font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <BaseLayout>
              <ContainerLayout>{children}</ContainerLayout>
            </BaseLayout>
            <ThemeSwitcher />
          </TooltipProvider>
          <Toaster
            position="bottom-left"
            closeButton
            icons={{ loading: <Icons.loading /> }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
