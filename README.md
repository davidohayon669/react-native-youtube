# react-native-youtube
A `<YouTube/>` component for React Native.

Uses Google's official [youtube-ios-player-helper](https://github.com/youtube/youtube-ios-player-helper) and exposes much of the API into React Native.

## Screenshot

![Screenshot of the example app](https://github.com/paramaggarwal/react-native-youtube/raw/master/Screenshot.png)

## Usage

```javascript
<YouTube
  videoId="KVZ-P-ZI6W4" // The YouTube video ID
  play={true}           // control playback of video with true/false
  hidden={false}        // control visiblity of the entire view
  playsInline={true}    // control whether the video should play inline
  
  onReady={(e)=>{this.setState({isReady: true})}}
  onChangeState={(e)=>{this.setState({status: e.state})}}
  onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
  onError={(e)=>{this.setState({error: e.error})}}
  
  style={{alignSelf: 'stretch', height: 300, backgroundColor: 'black', marginVertical: 10}}
/>
```

## Properties

* `videoID`: The YouTube video ID to play, can be changed to change the video playing.
* `play`: Controls playback of video with `true`/`false`. Setting it as `true` in the beginning itself makes the video autoplay on loading.
* `hidden`: Controls the `view.hidden` native property. For example, use this to hide player while it loads.
* `playsInline`: Controls whether the video should play inline, or in full screen.

## Events

* `onReady`: This function is called when the video player is setup.
* `onChangeState`: Sends the current state of the player on `e.state`. Common values are `buffering`/`playing`/`paused` and more.
* `onChangeQuality`: Sends the current quality of video playback on `e.quality`.
* `onError`: Sends any errors during video playback on `e.error`.

### Installation

(requires react-native >= 0.6.0)

1. Run `npm install react-native-youtube --save`
2. Open your project in Xcode, right click on `Libraries` and click `Add Files to "Your Project Name"`:
   * ![Screenshot](http://i.imgur.com/pOdaLFF.png)
3. Select `RCTYouTube.xcodeproj` from the Finder.
4. Add `libRCTYouTube.a` to `Build Phases -> Link Binary With Libraries`:
   ![(Screenshot)](http://i.imgur.com/iuvEhan.png).
5. Add `YTPlayerView-iframe-player.html` asset file to project and to `Build Phases -> Copy Bundle Resources`
6. Whenever you want to use it within React code now you can: `var YouTube =
   require('react-native-youtube');`

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
Param Aggarwal (paramaggarwal@gmail.com)

## License
MIT License
