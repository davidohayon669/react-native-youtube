import { NativeModules } from 'react-native';

const { YouTubeStandaloneModule } = NativeModules;

export const YouTubeStandaloneAndroid = !YouTubeStandaloneModule
  ? null
  : {
      playVideo: ({ apiKey, videoId, autoplay = false, lightboxMode = false, startTime = 0 }) =>
        YouTubeStandaloneModule.playVideo(
          apiKey,
          videoId,
          autoplay,
          lightboxMode,
          Number.parseInt(startTime * 1000, 10),
        ),
      playVideos: ({
        apiKey,
        videoIds,
        autoplay = false,
        lightboxMode = false,
        startIndex = 0,
        startTime = 0,
      }) =>
        YouTubeStandaloneModule.playVideos(
          apiKey,
          videoIds,
          autoplay,
          lightboxMode,
          Number.parseInt(startIndex, 10),
          Number.parseInt(startTime * 1000, 10),
        ),
      playPlaylist: ({
        apiKey,
        playlistId,
        autoplay = false,
        lightboxMode = false,
        startIndex = 0,
        startTime = 0,
      }) =>
        YouTubeStandaloneModule.playPlaylist(
          apiKey,
          playlistId,
          autoplay,
          lightboxMode,
          Number.parseInt(startIndex, 10),
          Number.parseInt(startTime * 1000, 10),
        ),
    };
