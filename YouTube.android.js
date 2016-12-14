/**
 * @providesModule YouTube
 * @flow
 */

import React from 'react';
import ReactNative, {
  View,
  Text,
  requireNativeComponent,
  UIManager,
  NativeModules,
} from 'react-native';

const RCTYouTube = requireNativeComponent('ReactYouTube', YouTube, {
  nativeOnly: {
    onError: true,
    onReady: true,
    onChangeState: true,
    onChangeQuality: true,
  },
});

export default class YouTube extends React.Component {

  static propTypes = {
    // TODO: warn about the importance of apiKey and how to get it from google
    apiKey: React.PropTypes.string.isRequired,
    videoId: React.PropTypes.string,
    videoIds: React.PropTypes.arrayOf(React.PropTypes.string),
    playlistId: React.PropTypes.string,
    playsInline: React.PropTypes.bool,
    showinfo: React.PropTypes.bool,
    modestbranding: React.PropTypes.bool,
    controls: React.PropTypes.oneOf([0,1,2]),
    origin: React.PropTypes.string,
    play: React.PropTypes.bool,
    rel: React.PropTypes.bool,
    hidden: React.PropTypes.bool,
    // TODO: warn about "SERVICE_MISSING" and explain you need to have YouTube app on the device
    onError: React.PropTypes.func,
    onReady: React.PropTypes.func,
    onChangeState: React.PropTypes.func,
    onChangeQuality: React.PropTypes.func,
    loop: React.PropTypes.bool,
    style: View.propTypes.style,
  };

  static defaultProps = {
    loop: false,
  };

  constructor(props) {
    super(props);
    this._onError = this._onError.bind(this);
    this._onReady = this._onReady.bind(this);
    this._onChangeState = this._onChangeState.bind(this);
    this._onChangeQuality = this._onChangeQuality.bind(this);
  }

  _onError(event) {
    if (this.props.onError) this.props.onError(event.nativeEvent);
  }

  _onReady(event) {
    if (this.props.onReady) this.props.onReady(event.nativeEvent);
  }

  _onChangeState(event) {
    if (this.props.onChangeState) this.props.onChangeState(event.nativeEvent);
  }

  _onChangeQuality(event) {
    if (this.props.onChangeQuality) this.props.onChangeQuality(event.nativeEvent);
  }

  seekTo(seconds) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.ReactYouTube.Commands.seekTo,
      [parseInt(seconds, 10)],
    );
  }

  nextVideo() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.ReactYouTube.Commands.nextVideo,
      [],
    );
  }

  previousVideo() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.ReactYouTube.Commands.previousVideo,
      [],
    );
  }

  playVideoAt(index) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.ReactYouTube.Commands.playVideoAt,
      [parseInt(index, 10)],
    );
  }

  videosIndex() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeModule.videosIndex(ReactNative.findNodeHandle(this))
        .then(index => resolve(index))
        .catch(errorMessage => reject(errorMessage)));
  }

  render() {
    return (
      <RCTYouTube
        {...this.props}
        style={[{ overflow: 'hidden' }, this.props.style]}
        onError={this._onError}
        onReady={this._onReady}
        onChangeState={this._onChangeState}
        onChangeQuality={this._onChangeQuality}
      />
    )
  }
}
