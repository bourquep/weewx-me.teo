'use client';

import MetricCard from '@/components/MetricCard';
import PageHeader from '@/components/PageHeader';
import { useCurrentData } from '@/libs/DataSource';
import { Alert, AlertTitle, Box, CircularProgress, Grid2, Stack, styled, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

function plotTypeFromObservation(observation: string): 'line' | 'bar' {
  if (['windDir', 'rainRate', 'rain'].includes(observation)) {
    return 'bar';
  }

  return 'line';
}

export default function Home() {
  const { data, error, isLoading } = useCurrentData();
  const t = useTranslations();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">
          <AlertTitle>{t('Global.DataLoadErrorTitle')}</AlertTitle>
          {`${error}`}
        </Alert>
      </Box>
    );
  }

  return (
    <Stack>
      <PageHeader
        stationLocationName={data.station.location}
        stationCoordinates={`${data.station.latitude}, ${data.station.longitude}, ${data.station.altitude}`}
        pageTitle={t('Current.PageTitle')}
        observationDate={new Date(data.report.time * 1000)}
      />

      <Offset />

      {/* <SectionHeader title={t('SectionHeaderTitle')} subtitle={t('SectionHeaderSubtitle')} /> */}

      <Grid2 container spacing={2} columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}>
        {data.observations
          .filter((x) => x != null)
          .map((observation) => (
            <Grid2 key={observation!.observation} size={4}>
              <MetricCard
                cardTitle={observation.label}
                metricUnit={observation.observation === 'windDir' ? '' : observation.unit}
                currentValue={
                  observation.observation === 'windDir' ? (observation.currentCompass ?? 'n/a') : observation.current
                }
                minValue={observation.min}
                minTimestamp={observation.minTime}
                maxValue={observation.observation === 'windDir' ? observation.maxCompass : observation.max}
                maxTimestamp={
                  observation.observation === 'windDir' ? t('Global.DominantWindDirectionLabel') : observation.maxTime
                }
                sumValue={observation.sum}
                sparkLineData={observation.past24h}
                sparkLinePlotType={plotTypeFromObservation(observation.observation)}
              />
            </Grid2>
          ))}
      </Grid2>

      <Typography mt={2} variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        {t('Current.PageFootnote')}
      </Typography>
    </Stack>
  );
}
