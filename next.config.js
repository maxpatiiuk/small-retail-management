/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'uk-UA'],
    defaultLocale: 'uk-UA',
    localeDetection: false,
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};
