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

import LoadingOrErrorIndicator from '@/components/LoadingOrErrorIndicator';
import { useNavigation } from '@/contexts/NavigationContext';
import { useWeekToDateData } from '@/libs/DataSource';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
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
              <Stack direction="row">
                <Table size="small" sx={{ width: 'auto', flexShrink: 0, alignSelf: 'center' }}>
                  <TableBody>
                    <TableRow>
                      <TableCell variant="head">Min</TableCell>
                      <TableCell>{format.number(data.observations[0]!.min!, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        {format.dateTime(new Date(data.observations[0]!.minTime! * 1000), {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">Max</TableCell>
                      <TableCell>{format.number(data.observations[0]!.max!, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        {format.dateTime(new Date(data.observations[0]!.maxTime! * 1000), {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">Avg</TableCell>
                      <TableCell>{format.number(data.observations[0]!.avg!, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>

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
                  sx={{ flexGrow: 1 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </>
  );
}
