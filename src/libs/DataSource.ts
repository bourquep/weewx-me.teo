import useSWR from 'swr';

const fetcher = async (url: string | URL | Request) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Status code does not indicate success: ${res.status}`);
  }

  return res.json();
};

// TODO: Dynamic baseUrl: /sample_data when localhost, /data when deployed
const baseUrl = '/sample_data';

export function useCurrentData() {
  const { data, error, isLoading } = useSWR(`${baseUrl}/current.json`, fetcher, { refreshInterval: 60 * 1 * 1000 });
  return {
    data: data as CurrentWeatherData,
    error,
    isLoading
  };
}
