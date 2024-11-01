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

import currentData from '../public/sample_data/current.json';
import globalData from '../public/sample_data/global.json';

type GlobalDataType = typeof globalData;
type CurrentWeatherDataType = typeof currentData;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GlobalData extends GlobalDataType {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CurrentWeatherData extends CurrentWeatherDataType {}
}
