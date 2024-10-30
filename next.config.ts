import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'export',
  distDir: `out/${process.env.METEO_BUILD_LOCALE || 'en'}`
};

export default withNextIntl(nextConfig);
