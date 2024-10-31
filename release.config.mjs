/**
 * @type {import('semantic-release').GlobalConfig}
 */
const semanticReleaseConfig = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'package/**/*',
            label: 'WeeWX Skin Extension Package'
          }
        ]
      }
    ]
  ]
};

export default semanticReleaseConfig;
