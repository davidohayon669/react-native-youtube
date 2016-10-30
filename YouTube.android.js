/**
 * @providesModule YouTube
 * @flow
 */

import React from 'react';
import ReactNative, {
  View,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  NativeMethodsMixin,
} from 'react-native';

const RCTYouTube = requireNativeComponent('ReactYouTube', YouTube, {
  nativeOnly: {
    onError: true,
    onReady: true,
    onChangeState: true,
    onChangeQuality: true,
    onProgress: true,
  },
});

export default class YouTube extends React.Component {

  static propTypes = {
    // TODO: warn about the importance of apiKey and how to get it from google
    apiKey: React.PropTypes.string.isRequired,
    videoId: React.PropTypes.string,
    videoIds: React.PropTypes.arrayOf(React.PropTypes.string),
    playlist: React.PropTypes.string,
    playsInline: React.PropTypes.bool,
    showinfo: React.PropTypes.bool,
    modestbranding: React.PropTypes.bool,
    controls: React.PropTypes.oneOf([0,1,2]),
    origin: React.PropTypes.string,
    play: React.PropTypes.bool,
    rel: React.PropTypes.bool,
    hidden: React.PropTypes.bool,
    onReady: React.PropTypes.func,
    onChangeState: React.PropTypes.func,
    onChangeQuality: React.PropTypes.func,
    // TODO: warn about "SERVICE_MISSING" and explain you need to have YouTube app on the device
    onError: React.PropTypes.func,
    loop: React.PropTypes.bool,
    style: View.propTypes.style,
  };

  static defaultProps = {
    loop: false,
  };

  constructor(props) {
    super(props);
    this._onReady = this._onReady.bind(this);
    this._onChangeState = this._onChangeState.bind(this);
    this._onChangeQuality = this._onChangeQuality.bind(this);
    this._onError = this._onError.bind(this);
    this._onProgress = this._onProgress.bind(this);
  }

  _nativeModuleRef = null;

  seekTo(seconds) {
    NativeModules.YouTubeModule.seekTo(parseInt(seconds, 10));
  }

  nextVideo() {
    NativeModules.YouTubeModule.nextVideo();
  }

  previousVideo() {
    NativeModules.YouTubeModule.previousVideo();
  }

  _onReady(event) {
    return this.props.onReady && this.props.onReady(event.nativeEvent);
  }

  _onChangeState(event) {
    return this.props.onChangeState && this.props.onChangeState(event.nativeEvent);
  }

  _onChangeQuality(event) {
    return this.props.onChangeQuality && this.props.onChangeQuality(event.nativeEvent);
  }

  _onProgress(event){
    return this.props.onProgress && this.props.onProgress(event.nativeEvent);
  }

  _onError(event) {
    return this.props.onError && this.props.onError(event.nativeEvent);
  }

  render() {
    return (
      <RCTYouTube
        ref={(component) => { this._nativeModuleRef = component; }}
        {...this.props}
        videoIds={Array.isArray(this.props.videoIds) ? this.props.videoIds.toString() : null}
        // playlist={typeof this.props.playlist === 'string' ? this.props.playlist : null}
        style={[styles.base, this.props.style]}
        onReady={this._onReady}
        onChangeState={this._onChangeState}
        onChangeQuality={this._onChangeQuality}
        onProgress={this._onProgress}
        onError={this._onError}
      />
    )
  }
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
