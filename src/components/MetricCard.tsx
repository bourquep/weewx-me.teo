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
import { NumberFormatOptions, useFormatter, useTranslations } from 'next-intl';
import IconLabel from './IconLabel';

type MetricKind = 'number' | 'wind';

interface MetricCardProps {
  cardTitle: string;
  sparkLineData: Array<Array<number>>;
  sparkLinePlotType: 'line' | 'bar';
  sparkLineMinValue?: number;
  sparkLineMaxValue?: number;
  currentValue: number;
  formattedCurrentValue?: string;
  minValue?: number;
  formattedMinValue?: string;
  minTimestamp?: number | string;
  maxValue?: number;
  formattedMaxValue?: string;
  maxTimestamp?: number | string;
  sumValue?: number;
  formattedSumValue?: string;
  metricUnit: string;
  metricKind: MetricKind;
}

export default function MetricCard({
  cardTitle,
  sparkLineData,
  sparkLinePlotType,
  sparkLineMinValue,
  sparkLineMaxValue,
  currentValue,
  formattedCurrentValue,
  minValue,
  formattedMinValue,
  minTimestamp,
  maxValue,
  formattedMaxValue,
  maxTimestamp,
  sumValue,
  formattedSumValue,
  metricUnit,
  metricKind
}: MetricCardProps) {
  const theme = useTheme();
  const format = useFormatter();
  const t = useTranslations();

  const graphData = sparkLineData.map(([, value]) => (value != null ? Number(value.toFixed(1)) : 0));
  const graphMinValue = sparkLineMinValue ?? Math.min(...graphData);
  const graphMaxValue = sparkLineMaxValue ?? Math.max(...graphData);
  const isGraphEmpty = graphData.filter((x) => x != 0).length == 0;

  function formatNumber(value?: number | string, options: NumberFormatOptions = { maximumFractionDigits: 1 }) {
    return typeof value === 'number' ? format.number(value, options) : value;
  }

  function formatTimestamp(timestamp?: number | string) {
    if (timestamp === undefined) return '';
    return typeof timestamp === 'number'
      ? format.dateTime(new Date(timestamp * 1000), { timeStyle: 'short' })
      : timestamp;
  }

  formattedCurrentValue ??= formatNumber(currentValue, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  formattedMinValue ??= formatNumber(minValue);
  const formattedMinTimestamp = formatTimestamp(minTimestamp);
  formattedMaxValue ??= formatNumber(maxValue);
  const formattedMaxTimestamp = formatTimestamp(maxTimestamp);
  formattedSumValue ??= formatNumber(sumValue);

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={cardTitle}
        action={metricUnit.length > 0 && <Chip variant="outlined" size="small" color="info" label={metricUnit} />}
      />

      <CardContent sx={{ paddingY: 0, flexGrow: 1 }}>
        {/* Current value + min/max/sum */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Current value */}
          {metricKind === 'number' && (
            <Typography variant={(formattedCurrentValue?.length ?? 0) < 5 ? 'h1' : 'h2'} sx={{ fontWeight: '500' }}>
              {formattedCurrentValue}
            </Typography>
          )}
          {metricKind === 'wind' && (
            <>
              <Typography variant="h1" sx={{ fontWeight: '500', translate: '0 8%' }}>
                <NavigationOutlinedIcon fontSize="inherit" sx={{ transform: `rotate(${currentValue + 180}deg)` }} />
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: '500' }}>
                {formattedCurrentValue}
              </Typography>
            </>
          )}

          {/* Spacer */}
          <Box flexGrow={1} />

          {/* Min/Max/Sum */}
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

              {/* Sum */}
              {formattedSumValue !== undefined && <IconLabel icon={FunctionsIcon} label={formattedSumValue} />}
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardMedia>
        {!isGraphEmpty && metricKind === 'number' && (
          <SparkLineChart
            height={40}
            plotType={sparkLinePlotType}
            data={graphData}
            xAxis={{
              data: sparkLineData.map(([timestamp]) => new Date(timestamp * 1000)),
              valueFormatter: (date) => format.dateTime(date, { timeStyle: 'short' })
            }}
            yAxis={{ min: graphMinValue, max: graphMaxValue }}
            colors={[theme.palette.grey[200]]}
            curve="natural"
            area
            disableAxisListener
            sx={{ pointerEvents: 'none' }}
          />
        )}

        {!isGraphEmpty && metricKind === 'wind' && (
          <Stack direction="row" spacing={0} justifyContent="space-evenly">
            {sparkLineData.map(([timestamp, value]) => (
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
