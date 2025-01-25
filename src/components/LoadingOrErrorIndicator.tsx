/*
weewx-me.teo
Copyright (C) 2024-2025 Pascal Bourque

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

import { Alert, AlertTitle, Box, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';

interface LoadingOrErrorIndicatorProps {
  data?: object;
  isLoading: boolean;
  error?: object;
  expectUndefinedData?: boolean;
}

export default function LoadingOrErrorIndicator({
  data,
  isLoading,
  error,
  expectUndefinedData
}: LoadingOrErrorIndicatorProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if ((!error && data === undefined && expectUndefinedData) ?? false) {
    return <></>;
  }

  if (error || data === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">
          <AlertTitle>{t('Global.DataLoadErrorTitle')}</AlertTitle>
          {`${error || t('Global.DataLoadUnexpectedErrorMessage')}`}
        </Alert>
      </Box>
    );
  }

  return <></>;
}
