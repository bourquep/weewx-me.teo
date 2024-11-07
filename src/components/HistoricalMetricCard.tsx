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

import { MetricKind, PlotType } from '@/libs/GraphUtils';
import AverageIcon from '@/resources/AverageIcon';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FunctionsIcon from '@mui/icons-material/Functions';
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
import { BarChart, LineChart } from '@mui/x-charts';
import { NumberFormatOptions, useFormatter, useTranslations } from 'next-intl';
import IconLabel from './IconLabel';

interface HistoricalMetricCardProps {
  metricKind: MetricKind;
  metricUnit: string;

  cardTitle: string;

  minValue?: number;
  formattedMinValue?: string;
  minTimestamp?: number | string;

  maxValue?: number;
  formattedMaxValue?: string;
  maxTimestamp?: number | string;

  avgValue?: number;
  formattedAvgValue?: string;
  avgLabel?: string;

  sumValue?: number;
  formattedSumValue?: string;
  sumLabel?: string;

  graphData: Array<Array<number>>;
  graphPlotType: PlotType;
  graphMinValue?: number;
  graphMaxValue?: number;
}

export default function HistoricalMetricCard(props: HistoricalMetricCardProps) {
  const t = useTranslations();
  const format = useFormatter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const graphData = props.graphData.map(([, value]) => (value != null ? Number(value.toFixed(1)) : null));
  const graphXAxis = props.graphData.map(([timestamp]) => (timestamp != null ? new Date(timestamp * 1000) : null));
  const graphMinValue = props.graphMinValue ?? Math.min(...graphData.filter((x) => x != null));
  const graphMaxValue = props.graphMaxValue ?? Math.max(...graphData.filter((x) => x != null));

  function formatNumber(value?: number | string, options: NumberFormatOptions = { maximumFractionDigits: 1 }) {
    return typeof value === 'number' ? format.number(value, options) : value;
  }

  function formatTimestamp(timestamp?: number | string) {
    if (timestamp === undefined) return '';
    return typeof timestamp === 'number'
      ? format.dateTime(new Date(timestamp * 1000), {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit'
        })
      : timestamp;
  }

  const formattedMinValue = props.formattedMinValue ?? formatNumber(props.minValue);
  const formattedMinTimestamp = formatTimestamp(props.minTimestamp);
  const formattedMaxValue = props.formattedMaxValue ?? formatNumber(props.maxValue);
  const formattedMaxTimestamp = formatTimestamp(props.maxTimestamp);
  const formattedSumValue = props.formattedSumValue ?? formatNumber(props.sumValue);
  const formattedAvgValue = props.formattedAvgValue ?? formatNumber(props.avgValue);

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={props.cardTitle}
        action={
          props.metricUnit.length > 0 && <Chip variant="outlined" size="small" color="info" label={props.metricUnit} />
        }
      />
      <CardContent sx={isMobile ? { paddingY: 0 } : {}}>
        {/* Min/max/avg/sum */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-start' }}>
          {/* Min */}
          {formattedMinValue !== undefined && (
            <Stack sx={{ alignItems: 'start' }}>
              <IconLabel icon={ArrowDownwardIcon} label={formattedMinValue} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formattedMinTimestamp}
              </Typography>
            </Stack>
          )}

          {/* Max */}
          {formattedMaxValue !== undefined && (
            <Stack sx={{ alignItems: 'start' }}>
              <IconLabel icon={ArrowUpwardIcon} label={formattedMaxValue} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formattedMaxTimestamp}
              </Typography>
            </Stack>
          )}

          {/* Average */}
          {formattedAvgValue !== undefined && (
            <Stack sx={{ alignItems: 'start' }}>
              <IconLabel icon={AverageIcon} label={formattedAvgValue} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {props.avgLabel ?? t('Labels.Average')}
              </Typography>
            </Stack>
          )}

          {/* Sum */}
          {formattedSumValue !== undefined && (
            <Stack sx={{ alignItems: 'start' }}>
              <IconLabel icon={FunctionsIcon} label={formattedSumValue} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {props.sumLabel ?? t('Labels.Sum')}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardMedia>
        {props.graphPlotType === 'line' && (
          <LineChart
            grid={{ horizontal: !isMobile }}
            series={[
              {
                data: graphData,
                showMark: false,
                area: props.metricKind !== 'wind',
                color: theme.palette.grey[200],
                curve: props.metricKind === 'wind' ? 'step' : 'linear'
              }
            ]}
            xAxis={[
              {
                data: graphXAxis,
                scaleType: 'time'
              }
            ]}
            yAxis={[
              {
                min: graphMinValue,
                max: graphMaxValue,
                tickInterval: props.metricKind === 'wind' ? [0, 90, 180, 270, 360] : 'auto',
                valueFormatter:
                  props.metricKind === 'wind'
                    ? (value) => {
                        const angle = (value + 360) % 360;
                        if (angle >= 337.5 || angle < 22.5) return t('CardinalPoints.North');
                        if (angle >= 22.5 && angle < 67.5) return t('CardinalPoints.NorthEast');
                        if (angle >= 67.5 && angle < 112.5) return t('CardinalPoints.East');
                        if (angle >= 112.5 && angle < 157.5) return t('CardinalPoints.SouthEast');
                        if (angle >= 157.5 && angle < 202.5) return t('CardinalPoints.South');
                        if (angle >= 202.5 && angle < 247.5) return t('CardinalPoints.SouthWest');
                        if (angle >= 247.5 && angle < 292.5) return t('CardinalPoints.West');
                        return t('CardinalPoints.NorthWest');
                      }
                    : undefined
              }
            ]}
            height={isMobile ? 100 : 300}
            margin={isMobile ? { top: 4, right: 4, bottom: 4, left: 4 } : {}}
            bottomAxis={isMobile ? null : undefined}
            leftAxis={isMobile ? null : undefined}
            slotProps={isMobile ? { popper: { placement: 'top-end' } } : {}}
          />
        )}

        {props.graphPlotType === 'bar' && (
          <BarChart
            grid={{ horizontal: !isMobile }}
            series={[
              {
                data: graphData,
                color: theme.palette.grey[200]
              }
            ]}
            xAxis={[
              {
                data: graphXAxis,
                scaleType: 'band'
              }
            ]}
            yAxis={[{ min: graphMinValue, max: graphMaxValue }]}
            height={isMobile ? 100 : 300}
            margin={isMobile ? { top: 4, right: 4, bottom: 4, left: 4 } : {}}
            bottomAxis={isMobile ? null : undefined}
            leftAxis={isMobile ? null : undefined}
            slotProps={isMobile ? { popper: { placement: 'top-end' } } : {}}
          />
        )}
      </CardMedia>
    </Card>
  );
}
