/**
 * @providesModule YouTube
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, requireNativeComponent, NativeModules } from 'react-native';

const RCTYouTube = requireNativeComponent('RCTYouTube', null)

export default class YouTube extends Component {

  static propTypes = {
    style: View.propTypes.style,
    videoId: PropTypes.string.isRequired,
    playsInline: PropTypes.bool,
    showinfo: PropTypes.bool,
    modestbranding: PropTypes.bool,
    controls: PropTypes.oneOf([0, 1, 2]),
    origin: PropTypes.string,
    play: PropTypes.bool,
    rel: PropTypes.bool,
    hidden: PropTypes.bool,
    onReady: PropTypes.func,
    onChangeState: PropTypes.func,
    onChangeQuality: PropTypes.func,
    onError: PropTypes.func,
    loop: PropTypes.bool,
  }

  static defaultProps = {
    loop: false,
  }

  constructor(props: Object) {
    super(props);
    this._onReady = this._onReady.bind(this);
    this._onChangeState = this._onChangeState.bind(this);
    this._onChangeQuality = this._onChangeQuality.bind(this);
    this._onError = this._onError.bind(this);
    this._onProgress = this._onProgress.bind(this);
    this._exportedProps = NativeModules.YouTubeManager
      && NativeModules.YouTubeManager.exportedProps;
  }

  _onReady(event) {
    return this.props.onReady && this.props.onReady(event.nativeEvent)
  }

  _onChangeState(event) {
    return this.props.onChangeState && this.props.onChangeState(event.nativeEvent);
  }

  _onChangeQuality(event) {
    return this.props.onChangeQuality && this.props.onChangeQuality(event.nativeEvent);
  }

  _onError(event) {
    return this.props.onError && this.props.onError(event.nativeEvent);
  }

  _onProgress(event) {
    return this.props.onProgress && this.props.onProgress(event.nativeEvent);
  }

  playVideo(): void {
    NativeModules.YouTubeManager.playVideo(ReactNative.findNodeHandle(this));
  }

  seekTo(seconds: number): void {
    NativeModules.YouTubeManager.seekTo(ReactNative.findNodeHandle(this), parseInt(seconds, 10));
  }

  loadVideoById(videoId: string): void {
    NativeModules.YouTubeManager.loadVideoById(ReactNative.findNodeHandle(this), videoId);
  }

  playVideoAt(index: number): void {
    NativeModules.YouTubeManager.playVideoAt(ReactNative.findNodeHandle(this), parseInt(index, 10));
  }

  nextVideo(): void {
    NativeModules.YouTubeManager.nextVideo(ReactNative.findNodeHandle(this));
  }

  previousVideo(): void {
    NativeModules.YouTubeManager.previousVideo(ReactNative.findNodeHandle(this));
  }

  playlistIndex() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeManager.playlistIndex(ReactNative.findNodeHandle(this))
        .then(index => resolve(index))
        .catch(errorMessage => reject(errorMessage)));
  }

  render() {
    const nativeProps = { ...this.props };
    nativeProps.style = [{ overflow: 'hidden' }, this.props.style];
    nativeProps.onYoutubeVideoReady = this._onReady;
    nativeProps.onYoutubeVideoChangeState = this._onChangeState;
    nativeProps.onYoutubeVideoChangeQuality = this._onChangeQuality;
    nativeProps.onYoutubeVideoError = this._onError;
    nativeProps.onYoutubeProgress = this._onProgress;

    if (this._exportedProps.playerParams) {
      nativeProps.playerParams = {
        videoId: this.props.videoId,
      }
      delete nativeProps.videoId;

      nativeProps.playerParams.playerVars = {};

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
    }

    return <RCTYouTube {...nativeProps} />;
  }
}
