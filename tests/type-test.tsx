import * as React from 'react';
import YouTube, { YouTubeStandaloneAndroid, YouTubeStandaloneIOS } from '../main';

const YouTubeTest = () => {
  YouTubeStandaloneAndroid.playVideo({
    apiKey: 'foo',
    videoId: 'bar',
  });
  YouTubeStandaloneIOS.playVideo('foo');
  return (
    <YouTube
      videoId={'foo'}
      videoIds={['foo', 'bar']}
      playlistId={'foo'}
      play
      loop
      fullscreen
      controls={1}
      showinfo
      modestbranding
      showFullscreenButton
      rel
      origin={'foo'}
      onError={() => {}}
      onReady={() => {}}
      onChangeState={() => {}}
      onChangeQuality={() => {}}
      onChangeFullscreen={() => {}}
      onProgress={() => {}}
      style={{ flex: 1 }}
    />
  );
};
