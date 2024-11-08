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

import CurrentMetricCard from '@/components/CurrentMetricCard';
import LoadingOrErrorIndicator from '@/components/LoadingOrErrorIndicator';
import { useNavigation } from '@/contexts/NavigationContext';
import { useCurrentWeatherData } from '@/libs/DataSource';
import { graphMinMaxValuesFromObservation, plotTypeFromObservation } from '@/libs/GraphUtils';
import { Grid2, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function Home() {
  const { data, isLoading, error } = useCurrentWeatherData();
  const { setTitle, setSubtitle } = useNavigation();

  const t = useTranslations();
  const format = useFormatter();

  useEffect(() => {
    setTitle(t('Current.PageTitle'));
    setSubtitle(
      data ? format.dateTime(dayjs.unix(data.report.time).toDate(), { dateStyle: 'medium', timeStyle: 'medium' }) : ''
    );
  }, [data]);

  return (
    <>
      <LoadingOrErrorIndicator data={data} isLoading={isLoading} error={error} />
      {data && (
        <Stack>
          <Grid2 container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}>
            {data.observations
              .filter((x) => x != null)
              .map((observation) => (
                <Grid2 key={observation.observation} size={4}>
                  <CurrentMetricCard
                    cardTitle={observation.label}
                    metricUnit={observation.observation === 'windDir' ? '' : observation.unit}
                    metricKind={observation.observation === 'windDir' ? 'wind' : 'number'}
                    currentValue={observation.current}
                    formattedCurrentValue={
                      observation.observation === 'windDir' ? observation.currentCompass : undefined
                    }
                    minValue={observation.min}
                    minTimestamp={observation.minTime}
                    maxValue={observation.max}
                    maxTimestamp={observation.maxTime}
                    avgValue={observation.avg}
                    formattedAvgValue={observation.observation === 'windDir' ? observation.avgCompass : undefined}
                    avgLabel={observation.observation === 'windDir' ? observation.avgLabel : undefined}
                    graphData={observation.graph}
                    graphPlotType={plotTypeFromObservation(observation.observation)}
                    graphMinValue={graphMinMaxValuesFromObservation(observation.observation)[0]}
                    graphMaxValue={graphMinMaxValuesFromObservation(observation.observation)[1]}
                  />
                </Grid2>
              ))}
          </Grid2>
          <Typography mt={2} mb={-2} variant="caption" sx={{ color: 'text.secondary' }}>
            <em>{t('Current.PageFootnote')}</em>
          </Typography>
        </Stack>
      )}
    </>
  );
}
