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
import { Grid2, Stack, Typography } from '@mui/material';
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
      data ? format.dateTime(new Date(data.report.time * 1000), { dateStyle: 'medium', timeStyle: 'medium' }) : ''
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
                <Grid2 key={observation!.observation} size={4}>
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
                    formattedMaxValue={observation.observation === 'windDir' ? observation.maxCompass : undefined}
                    maxTimestamp={observation.maxLabel ?? observation.maxTime}
                    sumValue={observation.sum}
                    graphData={observation.past24h}
                    graphPlotType={plotTypeFromObservation(observation.observation)}
                    graphMinValue={sparkLineMinMaxValuesFromObservation(observation.observation)[0]}
                    graphMaxValue={sparkLineMinMaxValuesFromObservation(observation.observation)[1]}
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

function plotTypeFromObservation(observation: string): 'line' | 'bar' {
  if (['windDir', 'windSpeed', 'windGust', 'rainRate', 'rain', 'UV', 'ET'].includes(observation)) {
    return 'bar';
  }

  return 'line';
}

function sparkLineMinMaxValuesFromObservation(observation: string): [number?, number?] {
  switch (observation) {
    case 'windDir':
      return [0, 360];

    case 'windSpeed':
      return [0, undefined];

    case 'windGust':
      return [0, undefined];

    case 'rainRate':
      return [0, undefined];

    case 'rain':
      return [0, undefined];

    case 'lightning_strike_count':
      return [0, undefined];

    case 'UV':
      return [0, undefined];

    default:
      return [undefined, undefined];
  }
}
