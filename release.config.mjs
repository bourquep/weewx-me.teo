/**
 * @type {import('semantic-release').GlobalConfig}
 */
const semanticReleaseConfig = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [{ type: 'chore', scope: 'deps', release: 'patch' }]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ Features', hidden: false },
            { type: 'fix', section: '🐛 Bug Fixes', hidden: false },
            { type: 'docs', section: '📚 Documentation', hidden: false },
            { type: 'perf', section: '⚡️ Performance Improvements', hidden: false },
            { type: 'refactor', section: '♻️ Code Refactoring', hidden: false },
            { type: 'style', section: '💄 Style', hidden: false },
            { type: 'chore', section: '🔧 Maintenance', hidden: false },
            { type: 'build', section: '📦 Build System', hidden: false },
            { type: 'ci', section: '👷 Continuous Integration', hidden: false },
            { type: 'revert', section: '⏪ Reverts', hidden: false }
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
