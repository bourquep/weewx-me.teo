/*
weewx-me.teo
Copyright (C) 2024-2025 Pascal Bourque

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

import AverageIcon from '@/resources/AverageIcon';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FunctionsIcon from '@mui/icons-material/Functions';
import NavigationIcon from '@mui/icons-material/Navigation';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import { Box, CardMedia, Chip, Stack, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import dayjs from 'dayjs';
import { NumberFormatOptions, useFormatter, useTranslations } from 'next-intl';
import IconLabel from './IconLabel';
import MetricCardProps from './MetricCardProps';

interface CurrentMetricCardProps extends MetricCardProps {
  currentValue: number;
  formattedCurrentValue?: string;
}

export default function CurrentMetricCard(props: CurrentMetricCardProps) {
  const theme = useTheme();
  const format = useFormatter();
  const t = useTranslations();

  const graphData = props.graphData.map(([, value]) => (value != null ? Number(value.toFixed(1)) : 0));
  const graphMinValue = props.graphMinValue ?? Math.min(...graphData);
  const graphMaxValue = props.graphMaxValue ?? Math.max(...graphData);
  const isGraphEmpty = graphData.filter((x) => x != 0).length == 0;

  function formatNumber(value?: number | string, options: NumberFormatOptions = { maximumFractionDigits: 1 }) {
    return typeof value === 'number' ? format.number(value, options) : value;
  }

  function formatTimestamp(timestamp?: number) {
    return timestamp === undefined ? '' : format.dateTime(dayjs.unix(timestamp).toDate(), { timeStyle: 'short' });
  }

  const formattedCurrentValue =
    props.formattedCurrentValue ??
    formatNumber(props.currentValue, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });

  const formattedMinValue = props.formattedMinValue ?? formatNumber(props.minValue);
  const formattedMinTimestamp = formatTimestamp(props.minTimestamp);
  const formattedMaxValue = props.formattedMaxValue ?? formatNumber(props.maxValue);
  const formattedMaxTimestamp = formatTimestamp(props.maxTimestamp);
  const formattedAvgValue = props.formattedAvgValue ?? formatNumber(props.avgValue);
  const formattedSumValue = props.formattedSumValue ?? formatNumber(props.sumValue);

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={props.cardTitle}
        action={
          props.metricUnit.length > 0 && <Chip variant="outlined" size="small" color="info" label={props.metricUnit} />
        }
      />

      <CardContent sx={{ paddingY: 0, flexGrow: 1 }}>
        {/* Current value + min/max/sum */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Current value */}
          {props.metricKind === 'number' && (
            <Typography variant={(formattedCurrentValue?.length ?? 0) <= 5 ? 'h1' : 'h2'} sx={{ fontWeight: '500' }}>
              {formattedCurrentValue}
            </Typography>
          )}
          {props.metricKind === 'wind' && (
            <>
              <Typography variant="h1" sx={{ fontWeight: '500', translate: '0 8%' }}>
                <NavigationOutlinedIcon
                  fontSize="inherit"
                  sx={{ transform: `rotate(${props.currentValue + 180}deg)` }}
                />
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: '500' }}>
                {formattedCurrentValue}
              </Typography>
            </>
          )}

          {/* Spacer */}
          <Box flexGrow={1} />

          {/* Min/Max/Avg/Sum */}
          {!isGraphEmpty && (
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end" alignItems="flex-end">
              {/* Min */}
              {formattedMinValue !== undefined && (
                <Stack alignItems="flex-end">
                  <IconLabel icon={ArrowDownwardIcon} label={formattedMinValue} />

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formattedMinTimestamp}
                  </Typography>
                </Stack>
              )}

              {/* Max */}
              {formattedMaxValue !== undefined && (
                <Stack alignItems="flex-end">
                  <IconLabel icon={ArrowUpwardIcon} label={formattedMaxValue} />

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formattedMaxTimestamp}
                  </Typography>
                </Stack>
              )}

              {/* Average */}
              {formattedAvgValue !== undefined && (
                <Stack alignItems="flex-end">
                  <IconLabel icon={AverageIcon} label={formattedAvgValue} />

                  {props.avgLabel && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {props.avgLabel}
                    </Typography>
                  )}
                </Stack>
              )}

              {/* Sum */}
              {formattedSumValue !== undefined && (
                <Stack alignItems="flex-end">
                  <IconLabel icon={FunctionsIcon} label={formattedSumValue} />

                  {props.sumLabel && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {props.sumLabel}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardMedia>
        {!isGraphEmpty && props.metricKind === 'number' && (
          <SparkLineChart
            height={40}
            plotType={props.graphPlotType}
            data={graphData}
            xAxis={{
              data: props.graphData.map(([timestamp]) => dayjs.unix(timestamp).toDate()),
              valueFormatter: (date: Date) => format.dateTime(date, { timeStyle: 'short' })
            }}
            yAxis={{ min: graphMinValue, max: graphMaxValue }}
            color={theme.palette.grey[200]}
            curve="natural"
            area
            sx={{ pointerEvents: 'none' }}
          />
        )}

        {!isGraphEmpty && props.metricKind === 'wind' && (
          <Stack direction="row" spacing={0} justifyContent="space-evenly">
            {props.graphData.map(([timestamp, value]) => (
              <Typography key={timestamp} variant="body2" sx={{ translate: '0 8%' }}>
                <NavigationIcon
                  key={timestamp}
                  fontSize="inherit"
                  htmlColor={theme.palette.grey[200]}
                  sx={{ transform: `rotate(${value + 180}deg)` }}
                />
              </Typography>
            ))}
          </Stack>
        )}

        {isGraphEmpty && (
          <Typography
            variant="caption"
            height={40}
            sx={{
              color: 'grey',
              fontStyle: 'italic',
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {t('Current.EmptyGraphMessage')}
          </Typography>
        )}
      </CardMedia>
    </Card>
  );
}
