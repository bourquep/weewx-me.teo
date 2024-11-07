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
import { Box, Grid2, IconButton, Stack, Typography } from '@mui/material';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function DayPage() {
  const { data, isLoading, error } = useDayData();
  const { setTitle, setSubtitle } = useNavigation();

  const t = useTranslations();
  const format = useFormatter();
  const formattedReportDate = data ? format.dateTime(new Date(data.report.time * 1000), { dateStyle: 'full' }) : '';

  useEffect(() => {
    setTitle(t('Day.PageTitle'));
    setSubtitle(formattedReportDate);
  }, [data]);

  return (
    <>
      <LoadingOrErrorIndicator data={data} isLoading={isLoading} error={error} />
      <Stack>
        <Stack direction="row" width="100%" marginY={2} alignItems="center">
          <Box flexGrow={1} />

          <IconButton>
            <ArrowLeftIcon />
          </IconButton>

          <Typography variant="h6" color="info" mx={2}>
            {formattedReportDate}
          </Typography>

          <IconButton>
            <ArrowRightIcon />
          </IconButton>

          <Box flexGrow={1} />
        </Stack>

        <Grid2 container spacing={2} columns={{ xs: 4, sm: 4, md: 4, lg: 8, xl: 8 }}>
          {data?.observations
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
      </Stack>
    </>
  );
}
