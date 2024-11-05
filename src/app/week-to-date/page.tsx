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

import IconLabel from '@/components/IconLabel';
import LoadingOrErrorIndicator from '@/components/LoadingOrErrorIndicator';
import { useNavigation } from '@/contexts/NavigationContext';
import { useWeekToDateData } from '@/libs/DataSource';
import FunctionIcon from '@/resources/FunctionIcon';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Card, CardContent, CardHeader, Chip, Stack, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function WeekToDataPage() {
  const { data, isLoading, error } = useWeekToDateData();
  const { setTitle, setSubtitle } = useNavigation();

  const t = useTranslations();
  const format = useFormatter();
  const theme = useTheme();

  useEffect(() => {
    setTitle(t('WeekToDate.PageTitle'));
    setSubtitle(
      data
        ? `${t('WeekToDate.PageSubtitleSince')} ${format.dateTime(new Date(data.report.time * 1000), { dateStyle: 'medium' })}`
        : ''
    );
  }, [data]);

  return (
    <>
      <LoadingOrErrorIndicator data={data} isLoading={isLoading} error={error} />
      {data && (
        <Stack>
          <Card variant="outlined">
            <CardHeader
              title="Temperature"
              action=<Chip variant="outlined" size="small" color="info" label={data.observations[0]!.unit} />
            />
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
                <Stack sx={{ alignItems: 'end' }}>
                  <IconLabel
                    icon={ArrowDownwardIcon}
                    label={format.number(data.observations[0]!.min!, { maximumFractionDigits: 2 })}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {format.dateTime(new Date(data.observations[0]!.minTime! * 1000), {
                      weekday: 'long',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Stack>
                <Stack sx={{ alignItems: 'end' }}>
                  <IconLabel
                    icon={ArrowUpwardIcon}
                    label={format.number(data.observations[0]!.max!, { maximumFractionDigits: 2 })}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {format.dateTime(new Date(data.observations[0]!.maxTime! * 1000), {
                      weekday: 'long',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Stack>
                <Stack sx={{ alignItems: 'end' }}>
                  <IconLabel
                    icon={FunctionIcon}
                    label={format.number(data.observations[0]!.avg!, { maximumFractionDigits: 2 })}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('Labels.Average')}
                  </Typography>
                </Stack>
              </Stack>

              <LineChart
                grid={{ horizontal: true }}
                series={[
                  {
                    data: data.observations[0]!.graph.map(([timestamp, value]) => value),
                    showMark: false,
                    area: true,
                    color: theme.palette.grey[200],
                    curve: 'natural'
                  }
                ]}
                xAxis={[
                  {
                    data: data.observations[0]!.graph.map(([timestamp, value]) => new Date(timestamp * 1000)),
                    scaleType: 'time'
                  }
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Stack>
      )}
    </>
  );
}
