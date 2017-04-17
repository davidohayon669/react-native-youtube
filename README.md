# react-native-youtube [![react-native-youtube](http://img.shields.io/npm/dm/react-native-youtube.svg)](https://www.npmjs.org/package/react-native-youtube) [![npm version](https://badge.fury.io/js/react-native-youtube.svg)](http://badge.fury.io/js/react-native-youtube) [![Dependency Status](https://david-dm.org/inProgress-team/react-native-youtube.svg)](https://david-dm.org/inProgress-team/react-native-youtube)
A `<YouTube />` component for React Native.

Uses Google's official [youtube-ios-player-helper](https://github.com/youtube/youtube-ios-player-helper) for iOS and [Android Player API](https://developers.google.com/youtube/android/player/) for Android and exposes much of the API, as declaratively as possible, into React Native.

## Screenshot

![Screenshot of the example app](https://github.com/inProgress-team/react-native-youtube/raw/v1/Screenshot.png)

## Usage

```javascript
<YouTube
  ref={(component) => {
    this._youTubePlayer = component;
  }}
  videoId="KVZ-P-ZI6W4"           // The YouTube video ID
  playlist="PLF797E961509B4EB5"   // A playlist's ID, overridden by `videoId`
  play={true}                     // control playback of video with true/false
  fullscreen={true}               // control whether the video should play in fullscreen or inline
  loop={true}                     // control whether the video should loop when ended

  onReady={e => this.setState({ isReady: true })}
  onChangeState={e => this.setState({ status: e.state })}
  onChangeQuality={e => this.setState({ quality: e.quality })}
  onError={e => this.setState({ error: e.error })}
  onProgress={e => this.setState({ currentTime: e.currentTime, duration: e.duration })}

  style={{ alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10 }}
/>
```
```javascript
this._youTubePlayer.seekTo(20);
this._youTubePlayer.nextVideo();
this._youTubePlayer.previousVideo();
this._youTubePlayer.playVideoAt(2);
```

## Properties

* `apiKey` *(Android)*: This parameter is required on Android for the YouTube API to work. [More Info](https://developers.google.com/youtube/android/player/register).
* `videoId`: The YouTube video ID to play. Can be changed while mounted to change the video playing.
* `videoIds`: An array of YouTube video IDs to be played as an interactive playlist. Can be changed while mounted. Overridden at start by `videoId`.
* `playlistId`: A YouTube Playlist's ID to play as an interactive playlist.
Can be changed while mounted. Overridden at start by `videoId` and `videoIds`.
* `play`: Controls playback of video with `true`/`false`. Setting it as `true` in the beginning itself makes the video autoplay on loading. Default `false`.
* `loop`: Loops the video. Default `false`.
* `fullscreen`: Controls whether the video should play inline or in fullscreen. Default `false`.
* `controls`: A number parameter to decide on the player's controls scheme. Supported values are `0`, `1`, `2`. Default `1`. On iOS the numbers conform to [These Parameters](https://developers.google.com/youtube/player_parameters?hl=en#controls). On Android the mapping is `0 = CHROMELSEE`, `1 = DEFAULT`, `2 = MINIMAL` ([More Info](https://developers.google.com/youtube/android/player/reference/com/google/android/youtube/player/YouTubePlayer.PlayerStyle)).
* `showFullscreenButton`: Show or hide Fullscreen button. Default `true`.
* `showinfo` *(iOS)*: Setting the parameter's value to false causes the player to not display information like the video title and uploader before the video starts playing. Default `true`.
* `modestbranding` *(iOS)*: This parameter lets you use a YouTube player that does not show a YouTube logo. Default `false`.
* `origin` *(iOS)*: This string parameter provides an extra security measure for the iFrame API.
* `rel` *(iOS)*: Show related videos at the end of the video. Default `true`.

The iOS implementation of this player uses the official YouTube iFrame under the hood, so most parameters behavior [can be further understood here.](https://developers.google.com/youtube/player_parameters)


## Events

* `onReady`: Called once when the video player is setup.
* `onChangeState`: Sends the current state of the player on `e.state`. Common values are `buffering`/`playing`/`paused` and more.
* `onChangeQuality`: Sends the current quality of video playback on `e.quality`.
* `onError`: Sends any errors before and during video playback on `e.error`.
* `onChangeFullscreen`: Called when the player enters or exits the fullscreen mode on `e.isFullscreen`.
* `onProgress` *(iOS)*: Sends any time progress made on `e.currentTime` and `e.duration`.

## Methods

* `seekTo(seconds)`: Seeks to a specified time in the video.
* `nextVideo()`: Skip to next video on a playlist (`videoIds` or `playlistId`). When `loop` is true, will skip to the first video from the last. If called on a single video, will restart the video.
* `previousVideo()`: opposite of `nextVideo()`.
* `playVideoAt(index)`: Will start playing the video at `index` (zero-based) position in a playlist (`videoIds` or `playlistId`. Not supported for `playlistId` on Android).
* `videosIndex()`: A Promise that returns the `index` (zero-based) of the video currently played in a playlist (`videoIds` or `playlistId`. Not supported for `playlistId` on Android).
* `reloadIframe()` *(iOS)*: Specific props (`fullscreen`, `modestbranding`, `showinfo`, `rel`, `controls`, `origin`) can only be set at mounting and initial loading of the underlying WebView that holds the YouTube iFrame (Those are `<iframe>` parameters). If you want to changed one of them during the lifecycle of the component you should know the usability cost of loading the WebView again and use this method right after the component was rendered with the updated prop.

## Installation

This component is confirmed to be working on react-native ~0.37 - ~0.42

* Install the latest version to your `package.json`:

`$ npm install react-native-youtube -S`

* Link the library to your iOS and Android projects with:

`$ react-native link`

**IMPORTANT! (iOS Only)**: To link assets/YTPlayerView-iframe-player.html to your project `react-native link` is not enough (As of RN ~0.37). You will need to *also* use the older tool it is based on, `rnpm` (This step must be done **after** `react-native link`):

* First, if you don't have it installed, globally install `rnpm` (Version 1.9.0):

`$ npm install -g rnpm`

* Then at the project's root folder type:

`$ rnpm link`

(This step can also be done manually by adding `../node_modules/react-native-youtube/assets/YTPlayerView-iframe-player.html` to your Xcode project's root directory)

**IMPORTANT! (Android Only)**: The Android implementation of this component needs to have the official YouTube app installed on the device. Otherwise an error event will trigger with `SERVICE_MISSING`.

#### OPTIONAL: Activated sound when iPhone (iOS) is on vibrate mode

Open AppDelegate.m and add :

* `#import <AVFoundation/AVFoundation.h>`

* `[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error: nil];` in your didFinishLaunchingWithOptions method

#### A note about the Android implementation and multiple `<YouTube />` instances
The YouTube API for Android is a *singleton*. What it means is that unlike the iOS implementation, no two players can be mounted and play a video at the same time. If you have two scenes that happen to live together, or come one after the other (such as when navigating to a new scene), The new `<YouTube />` Will take the focus of the singleton and play the video, but after being unmounted, the older mounted `<YouTube />` will not be able to take the role back, and will need to be re-mounted.

#### A note about working with Android Virtual Devices (AVDs)
Virtual devices running inside a desktop are usually much slower than a real device. For that reason, certain irregular behaviors can occur with the native player such as when the player fails to reposition correctly inside React-Native's views hierarchy and will only appear after another render of an ancestor view. In other times some of the player's internal mechanisms that prevent it from playing while being covered, or when the view is too small, will trigger for no good reason.

These behaviors can be pretty worrisome, and wrongfully get you to think the library is broken. At this point these irregularities seems to be unavoidable due to the way React-Native works and the too many moving parts that work in coordination. **Make sure to test your app on a real device to check if these irregularities persist. Most of them will not occur on an average hardware.**

These possible irregularities should be further taken care of by maintainers.

## Example and Development
This repository includes an example project that can be used for viewing, developing and testing all functionalities on a dedicated clean app project.

First copy the git repository and install the React-Native project inside `example`

```sh
git clone https://github.com/inProgress-team/react-native-youtube.git
cd react-native-youtube/example
npm install
react-native link
rnpm link
```

Then build and run with `react-native run-ios` / `react-native run-android` or your favorite IDE.

#### For Developers
The `react-native-youtube` dependency in the example's `package.json` points back to the working directory root at `file:../` so you can re-install it with `npm install react-native-youtube@file:../` (type this inside `example` directory) and test your changes on the example app right on the spot.


## Author
* Param Aggarwal (paramaggarwal@gmail.com)
* Ownership has been transferred to inProgress-team

## License
MIT License
