/**
 * @providesModule YouTube
 * @flow
 */

'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  View,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  NativeMethodsMixin,
  NativeAppEventEmitter
} from 'react-native';

const RCTYouTube = requireNativeComponent('RCTYouTube', null);

let readyEvent = null
let changeEvent = null
let progressEvent = null
let errorEvent = null

export default class YouTube extends Component {
  static propTypes = {
    style: View.propTypes.style,
    videoId: PropTypes.string.isRequired,
    playsInline: PropTypes.bool,
    showinfo: PropTypes.bool,
    modestbranding: PropTypes.bool,
    controls: PropTypes.oneOf([0,1,2]),
    origin: PropTypes.string,
    play: PropTypes.bool,
    rel: PropTypes.bool,
    hidden: PropTypes.bool,
    onReady: PropTypes.func,
    onChangeState: PropTypes.func,
    onChangeQuality: PropTypes.func,
    onError: PropTypes.func,
    loop: PropTypes.bool,
    fs: PropTypes.bool
  };

  static defaultProps = {
    loop: false
  };

  constructor(props) {
    super(props);
    this._exportedProps = NativeModules.YouTubeManager && NativeModules.YouTubeManager.exportedProps;
  }
  stopVideo() {
    NativeModules.YouTubeManager.stopVideo(ReactNative.findNodeHandle(this));
  }
  pauseVideo() {
    NativeModules.YouTubeManager.pauseVideo(ReactNative.findNodeHandle(this));
  }
  seekTo(seconds){
    NativeModules.YouTubeManager.seekTo(ReactNative.findNodeHandle(this), parseInt(seconds, 10));
  }
  componentWillMount() {
    changeEvent = NativeAppEventEmitter.addListener(
      'youtubeVideoChangeState',
      (event) => this.props.onChangeState && this.props.onChangeState(event.state)
    )
    readyEvent = NativeAppEventEmitter.addListener(
      'youtubeVideoReady',
      (event) => this.props.onReady && this.props.onReady()
    )
    progressEvent = NativeAppEventEmitter.addListener(
      'youtubeProgress',
      (event) => this.props.onProgress && this.props.onProgress(event)
    )
    errorEvent = NativeAppEventEmitter.addListener(
      'youtubeVideoError',
      (event) => this.props.onError && this.props.onError(event)
    )
  }
  componentWillUnmount() {
    changeEvent.remove()
    readyEvent.remove()
    progressEvent.remove()
    errorEvent.remove()
  }
  render() {
    var style = [styles.base, this.props.style];
    var nativeProps = Object.assign({}, this.props);
    nativeProps.style = style;

    /*
     * Try to use `playerParams` instead of settings `playsInline` and
     * `videoId` individually.
     */
    if (this._exportedProps) {
      if (this._exportedProps.playerParams) {
        nativeProps.playerParams = {
          videoId: this.props.videoId,
        };
        delete nativeProps.videoId;

        nativeProps.playerParams.playerVars = {};

        if (this.props.playsInline) {
          nativeProps.playerParams.playerVars.playsinline = 1;
          delete nativeProps.playsInline;
        };
        if (this.props.modestbranding) {
          nativeProps.playerParams.playerVars.modestbranding = 1;
          delete nativeProps.modestbranding;
        };

        if (this.props.showinfo!==undefined) {
          nativeProps.playerParams.playerVars.showinfo = this.props.showinfo ? 1 : 0;
          delete nativeProps.showinfo;
        };
        if (this.props.controls!==undefined) {
          nativeProps.playerParams.playerVars.controls = this.props.controls;
          delete nativeProps.controls;
        };
        if (this.props.origin!==undefined) {
          nativeProps.playerParams.playerVars.origin = this.props.origin;
          delete nativeProps.origin;
        };
        if (this.props.rel!==undefined) {
          nativeProps.playerParams.playerVars.rel = this.props.rel ? 1 : 0;
          delete nativeProps.rel;
        };
        if (this.props.fs!==undefined) {
          nativeProps.playerParams.playerVars.fs = this.props.fs ? 1 : 0;
          delete nativeProps.fs;
        };
      };
    } else {
      /*
       * For compatibility issues with an older version where setting both
       * `playsInline` and `videoId` in quick succession would cause the video
       * to sometimes not play.
       */
      delete nativeProps.playsInline;
    }

    return <RCTYouTube {... nativeProps} />;
  }
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
