/**
 * @providesModule YouTube
 * @flow
 */

import React, { Component, PropTypes } from 'react';
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

export default class YouTube extends Component {

  static propTypes = {
    style: View.propTypes.style,
    videoId: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
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

  seekTo(seconds){
    this._nativeModuleRef.seekTo(parseInt(seconds, 10));
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
