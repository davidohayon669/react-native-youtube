import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface YouTubeProps {
  videoId?: string;
  videoIds?: string[];
  playlistId?: string;
  apiKey?: string;
  play?: boolean;
  loop?: boolean;
  fullscreen?: boolean;
  controls?: 1 | 2 | 3;
  showinfo?: boolean;
  modestbranding?: boolean;
  showFullscreenButton?: boolean;
  fullscreenControlFlags?: number;
  rel?: boolean;
  origin?: string;
  onError?: (event: any) => void;
  onReady?: (event: any) => void;
  onChangeState?: () => void;
  onChangeQuality?: () => void;
  onChangeFullscreen?: (event: any) => void;
  onProgress?: (event: any) => void;
  style?: StyleProp<ViewStyle>;
}

declare class YouTube extends React.Component<YouTubeProps> {
  seekTo(seconds: number): void;
  nextVideo(): void;
  previousVideo(): void;
  playVideoAt(index: number): void;
  getVideosIndex(): Promise<number>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  reloadIframe(): void;

  static FULLSCREEN_FLAG_CONTROL_ORIENTATION?: number;
  static FULLSCREEN_FLAG_CONTROL_SYSTEM_UI?: number;
  static FULLSCREEN_FLAG_ALWAYS_FULLSCREEN_IN_LANDSCAPE?: number;
  static FULLSCREEN_FLAG_CUSTOM_LAYOUT?: number;
}

export declare const YouTubeStandaloneIOS: {
  playVideo(videoId: string): Promise<void>;
};

export declare const YouTubeStandaloneAndroid: {
  playVideo(params: {
    apiKey: string;
    videoId: string;
    autoplay?: boolean;
    lightboxMode?: boolean;
    startTime?: number;
  }): Promise<void>;
  playVideos(params: {
    apiKey: string;
    videoIds: string[];
    autoplay?: boolean;
    lightboxMode?: boolean;
    startIndex?: number;
    startTime?: number;
  }): Promise<void>;
  playPlaylist(params: {
    apiKey: string;
    playlistId: string[];
    autoplay?: boolean;
    lightboxMode?: boolean;
    startIndex?: number;
    startTime?: number;
  }): Promise<void>;
};

export default YouTube;
