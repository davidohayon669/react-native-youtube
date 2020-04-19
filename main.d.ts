import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type OnErrorArg = { error: string }

export type OnChangeQualityArg = { quality: string } // TODO doublecheck, havent seen this

export type OnChangeFullscreenArg = { isFullscreen: boolean }

export type OnProgressArg = { currentTime: number }

export type OnChangeStateArg =
  { state: 'started' } |
  { state: 'playing' } |
  { state: 'buffering' } |
  { state: 'paused' } |
  { state: 'stopped' } |
  { state: 'seeking', currentTime: number }

export type YouTubeState = 'started' | 'playing' | 'buffering' | 'paused' | 'stopped' | 'seeking'

export interface YouTubeProps {
  apiKey: string;
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
  onError?: (arg: OnErrorArg) => void;
  onReady?: () => void;
  onChangeState?: (arg: OnChangeStateArg) => void;
  onChangeQuality?: (arg: OnChangeQualityArg) => void;
  onChangeFullscreen?: (arg: OnChangeFullscreenArg) => void;
  onProgress?: (arg: OnProgressArg) => void;
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
    playlistId: string;
    autoplay?: boolean;
    lightboxMode?: boolean;
    startIndex?: number;
    startTime?: number;
  }): Promise<void>;
};

export default YouTube;
