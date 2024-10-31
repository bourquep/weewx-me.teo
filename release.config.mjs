/**
 * @type {import('semantic-release').GlobalConfig}
 */
const semanticReleaseConfig = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'package/weewx-me.teo/**/*',
            label: 'WeeWX Skin Extension Package'
          }
        ]
      }
    ]
  ]
};

export default semanticReleaseConfig;
