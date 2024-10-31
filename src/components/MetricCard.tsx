'use client';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FunctionsIcon from '@mui/icons-material/Functions';
import { Box, CardMedia, Chip, Stack, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { NumberFormatOptions, useFormatter, useTranslations } from 'next-intl';
import IconLabel from './IconLabel';

interface MetricCardProps {
  cardTitle: string;
  sparkLineData: Array<Array<number>>;
  sparkLinePlotType: 'line' | 'bar';
  currentValue: number | string;
  minValue?: number | string;
  minTimestamp?: number | string;
  maxValue?: number | string;
  maxTimestamp?: number | string;
  sumValue?: number | string;
  metricUnit: string;
}

export default function MetricCard({
  cardTitle,
  sparkLineData,
  sparkLinePlotType,
  currentValue,
  minValue,
  minTimestamp,
  maxValue,
  maxTimestamp,
  sumValue,
  metricUnit
}: MetricCardProps) {
  const theme = useTheme();
  const format = useFormatter();
  const t = useTranslations();

  const graphData = sparkLineData.map(([, value]) => Number(value.toFixed(1)));
  const graphMinValue = Math.min(...graphData);
  const graphMaxValue = Math.max(...graphData);
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

  const formattedCurrentValue = formatNumber(currentValue, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const formattedMinValue = formatNumber(minValue);
  const formattedMinTimestamp = formatTimestamp(minTimestamp);
  const formattedMaxValue = formatNumber(maxValue);
  const formattedMaxTimestamp = formatTimestamp(maxTimestamp);
  const formattedSumValue = formatNumber(sumValue);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={cardTitle}
        action={metricUnit.length > 0 && <Chip variant="outlined" size="small" color="info" label={metricUnit} />}
      />
      <CardContent sx={{ paddingY: 0 }}>
        {/* Current value + min/max/sum */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Current value */}
          <Typography variant="h2" sx={{ fontWeight: '500' }}>
            {formattedCurrentValue}
          </Typography>

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
        {!isGraphEmpty && (
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
        {isGraphEmpty && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {t('Current.EmptyGraphMessage')}
          </Typography>
        )}
      </CardMedia>
    </Card>
  );
}
