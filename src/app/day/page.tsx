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
import { Alert, Box, Button, Grid2, IconButton, Popover, Stack, useMediaQuery, useTheme } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useFormatter, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DayPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlDay = searchParams.get('d');
  const parsedDay = urlDay ? dayjs(urlDay, 'YYYY-MM-DD', true) : undefined;
  const urlDate = parsedDay?.isValid() ? parsedDay : dayjs().startOf('day').subtract(1, 'day');

  const { data, isLoading, error } = useDayData(urlDate.format('YYYY-MM-DD'));
  const { setTitle, setSubtitle } = useNavigation();

  const t = useTranslations();
  const format = useFormatter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formattedReportDate = format.dateTime((data ? dayjs.unix(data.report.time) : urlDate).toDate(), {
    dateStyle: 'full'
  });

  useEffect(() => {
    setTitle(t('Day.PageTitle'));
    setSubtitle(formattedReportDate);
  }, [formattedReportDate]);

  const [dateCalendarAnchor, setDateCalendarAnchor] = useState<HTMLButtonElement | null>(null);
  const isDateCalendarOpen = Boolean(dateCalendarAnchor);

  const handleDateButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDateCalendarAnchor(event.currentTarget);
  };

  const handleDateCalendarClose = () => {
    setDateCalendarAnchor(null);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      const formatted = newDate.format('YYYY-MM-DD');
      router.push(`${pathname}?d=${formatted}`);
      handleDateCalendarClose();
    }
  };

  return (
    <>
      <LoadingOrErrorIndicator data={data} isLoading={isLoading} error={error} expectUndefinedData />

      <Stack>
        <Stack direction="row" width="100%" marginY={2} alignItems="center">
          {!isMobile && <Box flexGrow={1} />}

          <IconButton
            onClick={() => {
              const previous = urlDate.subtract(1, 'day').format('YYYY-MM-DD');
              router.push(`${pathname}?d=${previous}`);
            }}
          >
            <ArrowLeftIcon />
          </IconButton>

          {isMobile && <Box flexGrow={1} />}

          <Button
            onClick={handleDateButtonClick}
            variant="text"
            color="info"
            sx={{ minWidth: !isMobile ? 300 : undefined }}
          >
            {formattedReportDate}
          </Button>

          <Popover
            open={isDateCalendarOpen}
            anchorEl={dateCalendarAnchor}
            onClose={handleDateCalendarClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <DateCalendar value={urlDate} onChange={handleDateChange} disableFuture />
          </Popover>

          {isMobile && <Box flexGrow={1} />}

          <IconButton
            onClick={() => {
              const next = urlDate.add(1, 'day').format('YYYY-MM-DD');
              router.push(`${pathname}?d=${next}`);
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
