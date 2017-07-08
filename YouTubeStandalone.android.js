import React from "react";
import { NativeModules } from "react-native";

const { YouTubeStandaloneModule } = NativeModules;

export const YouTubeStandaloneAndroid = !YouTubeStandaloneModule ? null : {
  playVideo: ({ apiKey, videoId, autoplay = false, lightboxMode = false, startTime = 0 }) =>
    new Promise((resolve, reject) =>
      YouTubeStandaloneModule.playVideo(
        apiKey,
        videoId,
        autoplay,
        lightboxMode,
        Number.parseInt(startTime * 1000, 10),
      )
        .then(() => resolve())
        .catch(errorMessage => reject(errorMessage))),
};
