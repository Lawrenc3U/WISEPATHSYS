// Optional dotenv loading - Expo has built-in .env support

try {
  require("dotenv").config();
} catch (error) {
  console.log(
    "Note: dotenv not installed, using Expo's built-in .env support"
  );
}

export default {
  expo: {
    name: "Wisepath",
    slug: "wisepath",
    version: "1.0.0",

    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },

    android: {
      package: "com.wisepathsys.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },

    ios: {
      supportsTablet: true,
    },

    assetBundlePatterns: ["**/*"],

    web: {
      favicon: "./assets/favicon.png",
    },

    plugins: [
      "expo-font",
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow WisePath to access your photos for your profile picture.",
        },
      ],
      "expo-splash-screen",
    ],

    extra: {
      eas: {
        projectId: "a20168cf-6ca5-4060-a29c-a10fb6421ce6",
      },
    },

    scheme: "wisepath",

    experiments: {
      tsconfigPaths: true,
      typedRoutes: false,
    },
  },
};