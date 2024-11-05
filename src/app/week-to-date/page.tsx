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
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function WeekToDataPage() {
  const { data, isLoading, error } = useWeekToDateData();
  const { setTitle, setSubtitle } = useNavigation();

  const t = useTranslations();
  const format = useFormatter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            <CardContent sx={isMobile ? { paddingY: 0 } : {}}>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-start' }}>
                <Stack sx={{ alignItems: 'start' }}>
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
                <Stack sx={{ alignItems: 'start' }}>
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
                <Stack sx={{ alignItems: 'start' }}>
                  <IconLabel
                    icon={FunctionIcon}
                    label={format.number(data.observations[0]!.avg!, { maximumFractionDigits: 2 })}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('Labels.Average')}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>

            <CardMedia>
              <LineChart
                grid={{ horizontal: !isMobile }}
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
                    scaleType: 'time',
                    min: new Date(data.observations[0]!.graph.at(0)![0] * 1000),
                    max: new Date(data.observations[0]!.graph.at(-1)![0] * 1000)
                  }
                ]}
                yAxis={
                  isMobile
                    ? [
                        {
                          min: Math.min(...data.observations[0]!.graph.map(([timestamp, value]) => value)) - 1,
                          max: Math.max(...data.observations[0]!.graph.map(([timestamp, value]) => value)) + 1
                        }
                      ]
                    : []
                }
                height={isMobile ? 100 : 300}
                margin={isMobile ? { top: 4, right: 4, bottom: 4, left: 4 } : {}}
                bottomAxis={isMobile ? null : undefined}
                leftAxis={isMobile ? null : undefined}
                slotProps={isMobile ? { popper: { placement: 'top-end' } } : {}}
              />
            </CardMedia>
          </Card>
        </Stack>
      )}
    </>
  );
}
