module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      '@babel/preset-typescript',
      require.resolve('babel-preset-react-app'),
    ],
    plugins: [
      [
        'babel-plugin-fbt',
        {
          fbtEnumManifest: require('./.enum_manifest.json'),
          extraOptions: { __self: true },
        },
      ],
      'babel-plugin-fbt-runtime',
    ],
  }
}
