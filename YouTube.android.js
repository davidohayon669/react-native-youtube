/**
 * @providesModule YouTube
 */

import React, { PropTypes } from 'react';
import ReactNative, {
  View,
  Text,
  StyleSheet,
  requireNativeComponent,
  UIManager,
  NativeModules,
  BackHandler,
} from 'react-native';

const RCTYouTube = requireNativeComponent('ReactYouTube', YouTube, {
  nativeOnly: {
    onYouTubeError: true,
    onYouTubeErrorReady: true,
    onYouTubeErrorChangeState: true,
    onYouTubeErrorChangeQuality: true,
    onYouTubeChangeFullscreen: true,
  },
});

export default class YouTube extends React.Component {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    videoId: PropTypes.string,
    videoIds: PropTypes.arrayOf(PropTypes.string),
    playlistId: PropTypes.string,
    play: PropTypes.bool,
    loop: PropTypes.bool,
    fullscreen: PropTypes.bool,
    controls: PropTypes.oneOf([0, 1, 2]),
    showFullscreenButton: PropTypes.bool,
    onError: PropTypes.func,
    onReady: PropTypes.func,
    onChangeState: PropTypes.func,
    onChangeQuality: PropTypes.func,
    onChangeFullscreen: PropTypes.func,
    style: View.propTypes.style,
  };

  static defaultProps = {
    showFullscreenButton: true,
  };

  constructor(props) {
    super(props);
    if (props.playsInline !== undefined) {
      throw new Error('YouTube.android.js: `playsInline` prop was dropped. Please use `fullscreen`')
    }

    this.state = {
      hiddenRenderText: 'o',
      fullscreen: props.fullscreen,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backAndroidHandler);
  }

  componentWillReceiveProps(nextProps) {
    // Translate next `fullscreen` prop to state
    if (nextProps.fullscreen !== this.props.fullscreen) {
      this.setState({ fullscreen: nextProps.fullscreen })
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backAndroidHandler);
  }

  _backAndroidHandler = () => {
    if (this.state.fullscreen) {
      this.setState({ fullscreen: false })
      return true
    }
    return false;
  }

  _onError = (event) => {
    if (this.props.onError) this.props.onError(event.nativeEvent);
  }

  _onReady = (event) => {
    // Look at the JSX for info about this
    this.setState({ hiddenRenderText: 'x' });
    if (this.props.onReady) this.props.onReady(event.nativeEvent);
  }

  _onChangeState = (event) => {
    if (this.props.onChangeState) this.props.onChangeState(event.nativeEvent);
  }

  _onChangeQuality = (event) => {
    if (this.props.onChangeQuality) this.props.onChangeQuality(event.nativeEvent);
  }

  _onChangeFullscreen = (event) => {
    const { isFullscreen } = event.nativeEvent;
    if (this.state.fullscreen !== isFullscreen) this.setState({ fullscreen: isFullscreen });
    if (this.props.onChangeFullscreen) this.props.onChangeFullscreen(event.nativeEvent);
  }

  seekTo(seconds) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef),
      UIManager.ReactYouTube.Commands.seekTo,
      [parseInt(seconds, 10)],
    );
  }

  nextVideo() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef),
      UIManager.ReactYouTube.Commands.nextVideo,
      [],
    );
  }

  previousVideo() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef),
      UIManager.ReactYouTube.Commands.previousVideo,
      [],
    );
  }

  playVideoAt(index) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef),
      UIManager.ReactYouTube.Commands.playVideoAt,
      [parseInt(index, 10)],
    );
  }

  videosIndex() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeModule
        .videosIndex(ReactNative.findNodeHandle(this._nativeComponentRef))
        .then(index => resolve(index))
        .catch(errorMessage => reject(errorMessage)));
  }

  currentTime() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeModule
        .currentTime(ReactNative.findNodeHandle(this._nativeComponentRef))
        .then(currentTime => resolve(currentTime))
        .catch(errorMessage => reject(errorMessage)));
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <RCTYouTube
          ref={component => {
            this._nativeComponentRef = component;
          }}
          {...this.props}
          fullscreen={this.state.fullscreen}
          style={styles.nativeModule}
          onYouTubeError={this._onError}
          onYouTubeReady={this._onReady}
          onYouTubeChangeState={this._onChangeState}
          onYouTubeChangeQuality={this._onChangeQuality}
          onYouTubeChangeFullscreen={this._onChangeFullscreen}
        />
        {/*
          The Android YouTube native player is pretty problematic when it comes to
          mounting correctly and rendering inside React-Native's views hierarchy.
          For now we must force a real render of one of its ancestors, right after
          the onReady event, to make it smoothly appear after ready.
          */
        }
        <Text style={styles.hiddenRenderText}>{this.state.hiddenRenderText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Protection against `UNAUTHORIZED_OVERLAY` error coming from the native YouTube module.
  // This module is pretty sensitive even when other views are only close to covering it.
  container: {
    padding: StyleSheet.hairlineWidth,
    backgroundColor: 'black',
  },
  nativeModule: {
    flex: 1,
  },
  hiddenRenderText: {
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: -10000,
  },
});
