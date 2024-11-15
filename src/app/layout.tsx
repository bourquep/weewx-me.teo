/*
weewx-me.teo
Copyright (C) 2024 Pascal Bourque

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageFooter from '@/components/PageFooter';
import PageHeader from '@/components/PageHeader';
import MUILocalizationProvider from '@/contexts/MUILocalizationProvider';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { StaticNextIntlClientProvider } from '@/i18n/StaticNextIntlClientProvider';
import theme from '@/theme';
import { Stack } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { Roboto } from 'next/font/google';
import { Suspense } from 'react';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto'
});

export const metadata: Metadata = {
  // TODO: Dynamically generate metadata title and description
  title: 'Me.teo weather dashboard',
  description: 'Weather dashboard generated by the "me.teo" WeeWX skin.',
  applicationName: 'Me.teo',
  appleWebApp: {
    capable: true,
    title: 'Me.teo'
  },
  authors: [{ name: 'Pascal Bourque' }],
  category: 'Weather',
  generator: 'WeeWX'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <meta name="theme-color" content="#26c6da" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#272727" media="(prefers-color-scheme: dark)" />

      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <StaticNextIntlClientProvider locale={locale} messages={messages}>
              <MUILocalizationProvider locale={locale}>
                <NavigationProvider>
                  <GoogleAnalytics />
                  <Stack>
                    <PageHeader />
                    <Suspense fallback=<p>Loading...</p>>{children}</Suspense>
                    <PageFooter />
                  </Stack>
                </NavigationProvider>
              </MUILocalizationProvider>
            </StaticNextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}