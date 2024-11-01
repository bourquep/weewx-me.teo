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

import useSWR from 'swr';

const fetcher = async (url: string | URL | Request) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Status code does not indicate success: ${res.status}`);
  }

  return res.json();
};

const baseUrl = process.env.NODE_ENV === 'production' ? '/data' : '/sample_data';

export function useGlobalData() {
  const { data, error, isLoading } = useSWR(`${baseUrl}/global.json`, fetcher, { refreshInterval: 60 * 1 * 1000 });
  return {
    data: data as GlobalData,
    error,
    isLoading
  };
}

export function useCurrentData() {
  const { data, error, isLoading } = useSWR(`${baseUrl}/current.json`, fetcher, { refreshInterval: 60 * 1 * 1000 });
  return {
    data: data as CurrentWeatherData,
    error,
    isLoading
  };
}
