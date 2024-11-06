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

export type PlotType = 'line' | 'bar';
export type MetricKind = 'number' | 'wind';

export function plotTypeFromObservation(observation: string): PlotType {
  if (['rainRate', 'rain', 'UV', 'ET'].includes(observation)) {
    return 'bar';
  }

  return 'line';
}

export function graphMinMaxValuesFromObservation(observation: string): [number?, number?] {
  switch (observation) {
    case 'windDir':
      return [0, 360];

    case 'windSpeed':
      return [0, undefined];

    case 'windGust':
      return [0, undefined];

    case 'rainRate':
      return [0, undefined];

    case 'rain':
      return [0, undefined];

    case 'lightning_strike_count':
      return [0, undefined];

    case 'UV':
      return [0, undefined];

    default:
      return [undefined, undefined];
  }
}
