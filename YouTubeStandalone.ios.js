import React from 'react';
import { NativeModules } from 'react-native';

const { YouTubeStandalone } = NativeModules;

export const YouTubeStandaloneIOS = !YouTubeStandalone
  ? null
  : {
      playVideo: videoId =>
        new Promise((resolve, reject) => {
          YouTubeStandalone.playVideo(videoId)
            .then(() => resolve())
            .catch(errorMessage => reject(errorMessage));
        }),
    };
