const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK + Expo SDK 53+ (fixes "Component auth has not been registered yet")
// https://docs.expo.dev/guides/using-firebase/#configure-metro
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
