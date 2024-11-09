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

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import useSWR from 'swr';

dayjs.extend(duration);

const fetcher = async (url: string | URL | Request) => {
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) {
      return undefined;
    }
    throw new Error(`Status code does not indicate success: ${res.status}`);
  }

  return res.json();
};

const baseUrl = process.env.NODE_ENV === 'production' ? '/data' : '/sample_data';

export function useGlobalData() {
  return useSWR<GlobalData>(`${baseUrl}/global.json`, fetcher);
}

export function useCurrentWeatherData() {
  return useSWR<CurrentWeatherData>(`${baseUrl}/current.json`, fetcher, {
    refreshInterval: dayjs.duration(1, 'minute').asMilliseconds()
  });
}

export function useWeekToDateData() {
  return useSWR<WeekToDateData>(`${baseUrl}/week-to-date.json`, fetcher, {
    refreshInterval: dayjs.duration(1, 'hour').asMilliseconds()
  });
}

export function useMonthToDateData() {
  return useSWR<MonthToDateData>(`${baseUrl}/month-to-date.json`, fetcher, {
    refreshInterval: dayjs.duration(1, 'hour').asMilliseconds()
  });
}

export function useDayData(formattedDay: string) {
  return useSWR<DayData>(`${baseUrl}/day-${formattedDay}.json`, fetcher, {
    refreshInterval: dayjs.duration(1, 'minute').asMilliseconds()
  });
}

export function useMonthData(formattedMonth: string) {
  return useSWR<MonthData>(`${baseUrl}/month-${formattedMonth}.json`, fetcher, {
    refreshInterval: dayjs.duration(1, 'day').asMilliseconds()
  });
}

export function useYearData(formattedYear: string) {
  return useSWR<YearData>(`${baseUrl}/year-${formattedYear}.json`, fetcher, {
    refreshInterval: dayjs.duration(1, 'day').asMilliseconds()
  });
}
