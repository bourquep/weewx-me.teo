/**
 * @type {import('semantic-release').GlobalConfig}
 */
const semanticReleaseConfig = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/exec',
      {
        prepareCmd: './prepare_release.sh ${nextRelease.version}'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [{ path: 'package/weewx-me.teo.zip', label: 'Extension package' }]
      }
    ]
  ]
};

export default semanticReleaseConfig;
