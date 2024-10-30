import current from '../public/sample_data/current.json';

type Current = typeof current;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CurrentWeatherData extends Current {}
}
