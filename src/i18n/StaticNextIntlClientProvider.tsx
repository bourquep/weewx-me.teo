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

'use client';

import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

interface StaticNextIntlClientProviderProps {
  locale: string;
  messages?: AbstractIntlMessages;
  children: React.ReactNode;
}

export function StaticNextIntlClientProvider({ locale, messages, children }: StaticNextIntlClientProviderProps) {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <NextIntlClientProvider locale={locale} timeZone={timezone} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
