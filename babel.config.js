module.exports = function (api) {
  api.cache(true);

  return {
    // Keep Expo's default JSX runtime. NativeWind's jsxImportSource was
    // configured without Metro CSS wiring and can blank the entire UI.
    presets: ['babel-preset-expo'],
    // Reanimated 4 / worklets — must be listed last
    plugins: ['react-native-worklets/plugin'],
  };
};
