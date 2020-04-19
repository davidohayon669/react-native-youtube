// Before use: npm install react @types/react

import * as React from 'react';
import YouTube, { YouTubeStandaloneAndroid, YouTubeStandaloneIOS } from '../main';

const YouTubeTest = () => {
  YouTubeStandaloneAndroid.playVideo({
    apiKey: 'foo',
    videoId: 'bar',
  });
  YouTubeStandaloneIOS.playVideo('foo');
  const videoRef = React.useRef<YouTube>(null)
  React.useEffect(()=>{
    videoRef.current?.getCurrentTime()
    videoRef.current?.nextVideo()
    videoRef.current?.previousVideo()
    videoRef.current?.reloadIframe()
    videoRef.current?.getDuration()
    videoRef.current?.playVideoAt(1)
    videoRef.current?.seekTo(1000)
  },[])
  return (
    <YouTube
      apiKey={'YOUR_API_KEY_HERE'}
      ref={videoRef}
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
      onError={({error}) => {}}
      onReady={() => {}}
      onChangeState={({state}) => {}}
      onChangeQuality={({quality}) => {}}
      onChangeFullscreen={({isFullscreen}) => {}}
      onProgress={({currentTime}) => {}}
      style={{ flex: 1 }}
    />
  );
};
