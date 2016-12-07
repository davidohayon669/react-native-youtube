/**
 * @providesModule YouTube
 * @flow
 */

import React from 'react';
import ReactNative, {
  View,
  requireNativeComponent,
  NativeModules,
} from 'react-native';

const RCTYouTube = requireNativeComponent('RCTYouTube', null);

export default class YouTube extends React.Component {

  static propTypes = {
    videoId: React.PropTypes.string,
    videoIds: React.PropTypes.arrayOf(React.PropTypes.string),
    playlist: React.PropTypes.string,
    playsInline: React.PropTypes.bool,
    showinfo: React.PropTypes.bool,
    modestbranding: React.PropTypes.bool,
    controls: React.PropTypes.oneOf([0, 1, 2]),
    origin: React.PropTypes.string,
    play: React.PropTypes.bool,
    rel: React.PropTypes.bool,
    hidden: React.PropTypes.bool,
    onError: React.PropTypes.func,
    onReady: React.PropTypes.func,
    onChangeState: React.PropTypes.func,
    onChangeQuality: React.PropTypes.func,
    onProgress: React.PropTypes.func,
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

  _onProgress(event) {
    if (this.props.onProgress) this.props.onProgress(event.nativeEvent);
  }

  seekTo(seconds) {
    NativeModules.YouTubeManager.seekTo(ReactNative.findNodeHandle(this), parseInt(seconds, 10));
  }

  nextVideo() {
    NativeModules.YouTubeManager.nextVideo(ReactNative.findNodeHandle(this));
  }

  previousVideo() {
    NativeModules.YouTubeManager.previousVideo(ReactNative.findNodeHandle(this));
  }

  playVideoAt(index) {
    NativeModules.YouTubeManager.playVideoAt(ReactNative.findNodeHandle(this), parseInt(index, 10));
  }

  videosIndex() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeManager.videosIndex(ReactNative.findNodeHandle(this))
        .then(index => resolve(index))
        .catch(errorMessage => reject(errorMessage)));
  }

  render() {
    const nativeProps = { ...this.props };

    nativeProps.playerParams = {
      videoId: this.props.videoId,
    };
    delete nativeProps.videoId;

    nativeProps.playerParams.playerVars = {};

    if (this.props.videoIds && Array.isArray(this.props.videoIds)) {
      nativeProps.playerParams.videoId = this.props.videoIds[0];
      nativeProps.playerParams.playerVars.playlist = this.props.videoIds[1]
        ? this.props.videoIds.slice(1).toString() : null;
      delete nativeProps.videoIds;
    }

    if (this.props.playlist) {
      nativeProps.playerParams.playerVars.playlist = this.props.playlist;
      delete nativeProps.playlist;
    }

    if (this.props.playsInline) {
      nativeProps.playerParams.playerVars.playsinline = 1;
      delete nativeProps.playsInline;
    }

    if (this.props.modestbranding) {
      nativeProps.playerParams.playerVars.modestbranding = 1;
      delete nativeProps.modestbranding;
    }

    if (this.props.showinfo !== undefined) {
      nativeProps.playerParams.playerVars.showinfo = this.props.showinfo ? 1 : 0;
      delete nativeProps.showinfo;
    }

    if (this.props.controls !== undefined) {
      nativeProps.playerParams.playerVars.controls = this.props.controls;
      delete nativeProps.controls;
    }

    if (this.props.loop !== undefined) {
      nativeProps.playerParams.playerVars.loop = this.props.loop ? 1 : 0;
      delete nativeProps.loop;
    }

    if (this.props.origin !== undefined) {
      nativeProps.playerParams.playerVars.origin = this.props.origin;
      delete nativeProps.origin;
    }

    if (this.props.rel !== undefined) {
      nativeProps.playerParams.playerVars.rel = this.props.rel ? 1 : 0;
      delete nativeProps.rel;
    }

    return (
      <RCTYouTube
        {...nativeProps}
        style={[{ overflow: 'hidden' }, this.props.style]}
        onError={this._onError}
        onReady={this._onReady}
        onChangeState={this._onChangeState}
        onChangeQuality={this._onChangeQuality}
        onProgress={this._onProgress}
      />
    );
  }
}
