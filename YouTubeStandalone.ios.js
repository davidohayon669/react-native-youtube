import { NativeModules } from 'react-native';

const { YouTubeStandalone } = NativeModules;

export const YouTubeStandaloneIOS = !YouTubeStandalone
  ? null
  : { playVideo: (videoId) => YouTubeStandalone.playVideo(videoId) };
