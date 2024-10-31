/**
 * @type {import('semantic-release').GlobalConfig}
 */
const semanticReleaseConfig = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          {
            type: 'ci',
            release: 'patch'
          }
        ]
      }
    ],
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
