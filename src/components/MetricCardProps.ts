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

import { MetricKind, PlotType } from '@/libs/GraphUtils';

export default interface MetricCardProps {
  metricKind: MetricKind;
  metricUnit: string;

  cardTitle: string;

  minValue?: number;
  formattedMinValue?: string;
  minTimestamp?: number;

  maxValue?: number;
  formattedMaxValue?: string;
  maxTimestamp?: number;

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
