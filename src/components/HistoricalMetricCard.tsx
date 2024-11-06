import FunctionIcon from '@/resources/FunctionIcon';
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
import { LineChart } from '@mui/x-charts';
import { NumberFormatOptions, useFormatter, useTranslations } from 'next-intl';
import IconLabel from './IconLabel';

interface HistoricalMetricCardProps {
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

  sumValue?: number;
  formattedSumValue?: string;

  graphData: Array<Array<number>>;
  graphPlotType: 'line' | 'bar' | 'scatter';
  graphMinValue?: number;
  graphMaxValue?: number;
}

export default function HistoricalMetricCard(props: HistoricalMetricCardProps) {
  const t = useTranslations();
  const format = useFormatter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const graphData = props.graphData.map(([, value]) => (value != null ? Number(value.toFixed(1)) : 0));
  const graphXAxis = props.graphData.map(([timestamp]) => (timestamp != null ? new Date(timestamp * 1000) : null));
  const graphMinValue = props.graphMinValue ?? Math.min(...graphData);
  const graphMaxValue = props.graphMaxValue ?? Math.max(...graphData);

  function formatNumber(value?: number | string, options: NumberFormatOptions = { maximumFractionDigits: 1 }) {
    return typeof value === 'number' ? format.number(value, options) : value;
  }

  function formatTimestamp(timestamp?: number | string) {
    if (timestamp === undefined) return '';
    return typeof timestamp === 'number'
      ? format.dateTime(new Date(timestamp * 1000), {
          weekday: 'long',
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
              <IconLabel icon={FunctionIcon} label={formattedAvgValue} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('Labels.Average')}
              </Typography>
            </Stack>
          )}

          {/* Sum */}
          {formattedSumValue !== undefined && (
            <Stack sx={{ alignItems: 'start' }}>
              <IconLabel icon={FunctionsIcon} label={formattedSumValue} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('Labels.Sum')}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardMedia>
        <LineChart
          grid={{ horizontal: !isMobile }}
          series={[
            {
              data: graphData,
              showMark: false,
              area: true,
              color: theme.palette.grey[200],
              curve: 'natural'
            }
          ]}
          xAxis={[
            {
              data: graphXAxis,
              scaleType: 'time'
            }
          ]}
          yAxis={isMobile ? [{ min: graphMinValue - 1, max: graphMaxValue + 1 }] : []}
          height={isMobile ? 100 : 300}
          margin={isMobile ? { top: 4, right: 4, bottom: 4, left: 4 } : {}}
          bottomAxis={isMobile ? null : undefined}
          leftAxis={isMobile ? null : undefined}
          slotProps={isMobile ? { popper: { placement: 'top-end' } } : {}}
        />
      </CardMedia>
    </Card>
  );
}
