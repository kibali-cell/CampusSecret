module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  };
  