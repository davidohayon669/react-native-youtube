# react-native-youtube [![react-native-youtube](http://img.shields.io/npm/dm/react-native-youtube.svg)](https://www.npmjs.org/package/react-native-youtube) [![npm version](https://badge.fury.io/js/react-native-youtube.svg)](http://badge.fury.io/js/react-native-youtube) [![Dependency Status](https://david-dm.org/inProgress-team/react-native-youtube.svg)](https://david-dm.org/inProgress-team/react-native-youtube)
A `<YouTube/>` component for React Native.

Uses Google's official [youtube-ios-player-helper](https://github.com/youtube/youtube-ios-player-helper) and exposes much of the API into React Native.

## Screenshot

![Screenshot of the example app](https://github.com/paramaggarwal/react-native-youtube/raw/master/Screenshot.png)

## Usage

```javascript
<YouTube
  ref="youtubePlayer"
  videoId="KVZ-P-ZI6W4" // The YouTube video ID
  play={true}           // control playback of video with true/false
  hidden={false}        // control visiblity of the entire view
  playsInline={true}    // control whether the video should play inline
  loop={false}          // control whether the video should loop when ended

  onReady={(e)=>{this.setState({isReady: true})}}
  onChangeState={(e)=>{this.setState({status: e.state})}}
  onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
  onError={(e)=>{this.setState({error: e.error})}}
  onProgress={(e)=>{this.setState({currentTime: e.currentTime, duration: e.duration})}}

  style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10}}
/>
```
```javascript
this.refs.youtubePlayer.seekTo(20);
```

## Properties

* `videoID`: The YouTube video ID to play, can be changed to change the video playing.
* `play`: Controls playback of video with `true`/`false`. Setting it as `true` in the beginning itself makes the video autoplay on loading.
* `hidden`: Controls the `view.hidden` native property. For example, use this to hide player while it loads.
* `playsInline`: Controls whether the video should play inline, or in full screen.
* `rel`: Hides related videos at the end of the video. Default `false`.
* `loop`: Loops the video. Default `false`.
* `modestbranding`: This parameter lets you use a YouTube player that does not show a YouTube logo. Default `false`.
* `controls`: This parameter indicates whether the video player controls are displayed. Supported values are `0`, `1`, `2`. Default `1`. [More information](https://developers.google.com/youtube/player_parameters?hl=en#controls)
* `showinfo`: Setting the parameter's value to false causes the player to not display information like the video title and uploader before the video starts playing. Default `true`.
* `origin`: This parameter provides an extra security measure for the IFrame API.

## Events

* `onReady`: This function is called when the video player is setup.
* `onChangeState`: Sends the current state of the player on `e.state`. Common values are `buffering`/`playing`/`paused` and more.
* `onChangeQuality`: Sends the current quality of video playback on `e.quality`.
* `onError`: Sends any errors during video playback on `e.error`.
* `onProgress`: Sends any time progress made on `e.currentTime` and `e.duration`.

## Methods

* `seekTo(seconds)`: Seeks to a specified time in the video

### Installation

(requires react-native >= 0.6.0)

`$ rnpm install react-native-youtube`

`$ add YTPlayerView-iframe-player.html from Assets to your xcode project`

##### OPTIONAL : Activated sound when phone is on vibrate mode

Open AppDelegate.m and add :

* `#import <AVFoundation/AVFoundation.h>`

* `[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error: nil];` in your didFinishLaunchingWithOptions method

## Example
Try the included `RCTYouTubeExample`:

```sh
git clone git@github.com:paramaggarwal/react-native-youtube.git
cd react-native-youtube/Example
npm install
open RCTYouTubeExample.xcodeproj
```
Then `Cmd+R` to start the React Packager, build and run the project in the simulator.

## Author
* Param Aggarwal (paramaggarwal@gmail.com)
* Ownership has been transfered to inProgress-team

## License
MIT License
