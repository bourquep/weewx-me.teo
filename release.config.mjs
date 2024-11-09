/**
 * @type {import('semantic-release').GlobalConfig}
 */
const semanticReleaseConfig = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [{ type: 'chore', scope: 'deps', release: 'patch' }]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ Features' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'docs', section: '📚 Documentation' },
            { type: 'perf', section: '⚡️ Performance Improvements' },
            { type: 'refactor', section: '♻️ Code Refactoring' },
            { type: 'style', section: '💄 Style' },
            { type: 'chore', section: '🔧 Maintenance' },
            { type: 'build', section: '📦 Build System' },
            { type: 'ci', section: '👷 Continuous Integration' },
            { type: 'revert', section: '⏪ Reverts' }
          ]
        }
      }
    ],
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
