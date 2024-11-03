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

import MetricCard from '@/components/MetricCard';
import PageHeader from '@/components/PageHeader';
import { useCurrentWeatherData } from '@/libs/DataSource';
import { Alert, AlertTitle, Box, CircularProgress, Grid2, Link, Stack, styled, Typography } from '@mui/material';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useTranslations } from 'next-intl';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function Home() {
  const { global, current, isLoading, error } = useCurrentWeatherData();

  const t = useTranslations();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || global.data === undefined || current.data === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">
          <AlertTitle>{t('Global.DataLoadErrorTitle')}</AlertTitle>
          {`${error || t('Global.DataLoadUnexpectedErrorMessage')}`}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      {global.data.meta.googleAnalyticsId.length > 0 && <GoogleAnalytics gaId={global.data.meta.googleAnalyticsId} />}
      <Stack>
        <PageHeader
          stationLocationName={global.data.station.location}
          stationCoordinates={`${global.data.station.latitude}, ${global.data.station.longitude}, ${global.data.station.altitude}`}
          pageTitle={t('Current.PageTitle')}
          observationDate={new Date(current.data.report.time * 1000)}
        />

        <Offset />

        {/* <SectionHeader title={t('SectionHeaderTitle')} subtitle={t('SectionHeaderSubtitle')} /> */}

        <Grid2 container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}>
          {current.data.observations
            .filter((x) => x != null)
            .map((observation) => (
              <Grid2 key={observation!.observation} size={4}>
                <MetricCard
                  cardTitle={observation.label}
                  metricUnit={observation.observation === 'windDir' ? '' : observation.unit}
                  metricKind={observation.observation === 'windDir' ? 'wind' : 'number'}
                  currentValue={observation.current}
                  formattedCurrentValue={observation.observation === 'windDir' ? observation.currentCompass : undefined}
                  minValue={observation.min}
                  minTimestamp={observation.minTime}
                  maxValue={observation.max}
                  formattedMaxValue={observation.observation === 'windDir' ? observation.maxCompass : undefined}
                  maxTimestamp={
                    observation.observation === 'windDir' ? t('Global.DominantWindDirectionLabel') : observation.maxTime
                  }
                  sumValue={observation.sum}
                  sparkLineData={observation.past24h}
                  sparkLinePlotType={plotTypeFromObservation(observation.observation)}
                  sparkLineMinValue={sparkLineMinMaxValuesFromObservation(observation.observation)[0]}
                  sparkLineMaxValue={sparkLineMinMaxValuesFromObservation(observation.observation)[1]}
                />
              </Grid2>
            ))}
        </Grid2>

        <Typography mt={2} variant="caption" sx={{ color: 'text.secondary' }}>
          <em>{t('Current.PageFootnote')}</em>
          <br />
          <Link href="https://github.com/bourquep/weewx-me.teo" target="_blank">
            {global.data.meta.skin}
          </Link>
          {' | '}
          <Link href="https://github.com/weewx/weewx" target="_blank">
            {global.data.meta.generator}
          </Link>
        </Typography>
      </Stack>
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
