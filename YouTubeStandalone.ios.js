import React from 'react';
import { NativeModules } from 'react-native';

const { YTStandaloneModule } = NativeModules;

export const YouTubeStandalone = {
    playVideo: ({
      videoId
    }) =>
      new Promise((resolve, reject) => {
        YTStandaloneModule.playVideo(videoId)
        .then(() => resolve())
        .catch(errorMessage => reject(errorMessage))
      },
    ),
  };
