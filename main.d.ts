import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface YouTubeProps {
  videoId?: string;
  videoIds?: string[];
  playlistId?: string;
  play?: boolean;
  loop?: boolean;
  fullscreen?: boolean;
  controls?: 1 | 2 | 3;
  showinfo?: boolean;
  modestbranding?: boolean;
  showFullscreenButton?: boolean;
  rel?: boolean;
  origin?: string;
  onError?: () => void;
  onReady?: () => void;
  onChangeState?: () => void;
  onChangeQuality?: () => void;
  onChangeFullscreen?: () => void;
  onProgress?: () => void;
  style?: StyleProp<ViewStyle>;
}

declare class YouTube extends React.Component<YouTubeProps> {}

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
