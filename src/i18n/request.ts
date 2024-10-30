import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = process.env.METEO_BUILD_LOCALE || 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'America/New_York' // TODO: Don't hardcode the timezone
  };
});
