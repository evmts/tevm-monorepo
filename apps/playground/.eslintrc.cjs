module.exports = {
  extends: [
    '../../.eslintrc.js',
    'react-app',
    'plugin:react-query/recommended',
  ],
  plugins: ['eslint-plugin-testing-library'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@usedapp/core',
            importNames: ['useEthers'],
            message:
              'Imported useEthers from @usedapp/core.   Please import the wrapped version of useEthers from hooks/useEthers.',
          },
        ],
      },
    ],
  },
}
