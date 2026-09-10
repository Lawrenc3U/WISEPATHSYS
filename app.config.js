// Optional dotenv loading - Expo has built-in .env support
try {
  require("dotenv").config();
} catch (error) {
  // dotenv not installed, but that's okay - Expo will load .env automatically
  console.log("Note: dotenv not installed, using Expo's built-in .env support");
}

export default {
  expo: {
    name: "WISEPATHSYS",
    slug: "WISEPATHSYS",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/wisepath.jpg",
    splash: {
      image: "./assets/wisepath.jpg",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTabletMode: true,
      supportsMultiwindow: false
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/wisepath.jpg",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/wisepath.jpg"
    },
    plugins: [
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Inter-Regular.ttf",
            "./assets/fonts/Inter-Bold.ttf"
          ]
        }
      ]
    ],
    scheme: "wisepathsys",
    experiments: {
      tsconfigPaths: true,
      typedRoutes: false
    }
  }
};