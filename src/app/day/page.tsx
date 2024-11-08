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

import HistoricalMetricCard from '@/components/HistoricalMetricCard';
import LoadingOrErrorIndicator from '@/components/LoadingOrErrorIndicator';
import { useNavigation } from '@/contexts/NavigationContext';
import { useDayData } from '@/libs/DataSource';
import { graphMinMaxValuesFromObservation, plotTypeFromObservation } from '@/libs/GraphUtils';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Alert, Box, Grid2, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormatter, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DayPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const yesterday = new Date(Date.now() - 86400000);
  const urlDay =
    searchParams.get('d') ??
    `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const urlDate = new Date(urlDay + 'T00:00:00');

  const { data, isLoading, error } = useDayData(urlDay);
  const { setTitle, setSubtitle } = useNavigation();

  const t = useTranslations();
  const format = useFormatter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formattedReportDate = format.dateTime(data ? new Date(data.report.time * 1000) : urlDate, {
    dateStyle: 'full'
  });

  useEffect(() => {
    setTitle(t('Day.PageTitle'));
    setSubtitle(formattedReportDate);
  }, [formattedReportDate, data, urlDate]);

  return (
    <>
      <LoadingOrErrorIndicator data={data} isLoading={isLoading} error={error} expectUndefinedData />

      <Stack>
        <Stack direction="row" width="100%" marginY={2} alignItems="center">
          {!isMobile && <Box flexGrow={1} />}

          <IconButton
            onClick={() => {
              const previous = new Date(urlDate.getFullYear(), urlDate.getMonth(), urlDate.getDate() - 1);
              const formattedPrevious = `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, '0')}-${String(previous.getDate()).padStart(2, '0')}`;
              router.push(`${pathname}?d=${formattedPrevious}`);
            }}
          >
            <ArrowLeftIcon />
          </IconButton>

          {isMobile && <Box flexGrow={1} />}

          <Typography variant="h6" color="info" mx={2} minWidth={!isMobile ? 300 : undefined} textAlign="center">
            {formattedReportDate}
          </Typography>

          {isMobile && <Box flexGrow={1} />}

          <IconButton
            onClick={() => {
              const next = new Date(urlDate.getFullYear(), urlDate.getMonth(), urlDate.getDate() + 1);
              const formattedNext = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
              router.push(`${pathname}?d=${formattedNext}`);
            }}
          >
            <ArrowRightIcon />
          </IconButton>

          {!isMobile && <Box flexGrow={1} />}
        </Stack>

        {!isLoading && !error && !data && (
          <Box my={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Alert severity="warning">No data available for the selected day. Please select another day.</Alert>
          </Box>
        )}

        {data && (
          <Grid2 container spacing={2} columns={{ xs: 4, sm: 4, md: 4, lg: 8, xl: 8 }}>
            {data.observations
              .filter((x) => x != null)
              .map((observation) => (
                <Grid2 key={observation.observation} size={4}>
                  <HistoricalMetricCard
                    cardTitle={observation.label}
                    metricKind={observation.observation === 'windDir' ? 'wind' : 'number'}
                    metricUnit={observation.observation === 'windDir' ? '' : observation.unit}
                    minValue={observation.min}
                    minTimestamp={observation.minTime}
                    maxValue={observation.max}
                    maxTimestamp={observation.maxTime}
                    avgValue={observation.avg}
                    formattedAvgValue={observation.observation === 'windDir' ? observation.avgCompass : undefined}
                    avgLabel={observation.avgLabel}
                    sumValue={observation.sum}
                    graphData={observation.graph}
                    graphPlotType={plotTypeFromObservation(observation.observation)}
                    graphMinValue={graphMinMaxValuesFromObservation(observation.observation)[0]}
                    graphMaxValue={graphMinMaxValuesFromObservation(observation.observation)[1]}
                  />
                </Grid2>
              ))}
          </Grid2>
        )}
      </Stack>
    </>
  );
}
