/**
 * @providesModule YouTube
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
  View,
  ViewPropTypes,
  Text,
  StyleSheet,
  requireNativeComponent,
  UIManager,
  NativeModules,
  BackAndroid,
  BackHandler as BackHandlerModule,
} from 'react-native';

const BackHandler = BackHandlerModule || BackAndroid;

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
    resumePlayAndroid: PropTypes.bool,
    onError: PropTypes.func,
    onReady: PropTypes.func,
    onChangeState: PropTypes.func,
    onChangeQuality: PropTypes.func,
    onChangeFullscreen: PropTypes.func,
    style: (ViewPropTypes && ViewPropTypes.style) || View.propTypes.style,
  };

  static defaultProps = {
    showFullscreenButton: true,
    resumePlayAndroid: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      moduleMargin: StyleSheet.hairlineWidth * 2,
      fullscreen: props.fullscreen,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backPress);
  }

  componentWillReceiveProps(nextProps) {
    // Translate next `fullscreen` prop to state
    if (nextProps.fullscreen !== this.props.fullscreen) {
      this.setState({ fullscreen: nextProps.fullscreen });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backPress);
  }

  _backPress = () => {
    if (this.state.fullscreen) {
      this.setState({ fullscreen: false });
      return true;
    }
    return false;
  };

  _onError = event => {
    if (this.props.onError) this.props.onError(event.nativeEvent);
  };

  _onReady = event => {
    // The Android YouTube native module is pretty problematic when it comes to
    // mounting correctly and rendering inside React-Native's views hierarchy.
    // For now we must trigger some layout change to force a real render on it,
    // right after the onReady event, so it will smoothly appear after ready.
    // We also use the minimal margin to avoid `UNAUTHORIZED_OVERLAY` error from
    // the native module that is very sensitive to being covered or even touching
    // its containing view.
    this.setState({ moduleMargin: StyleSheet.hairlineWidth });
    if (this.props.onReady) this.props.onReady(event.nativeEvent);
  };

  _onChangeState = event => {
    if (this.props.onChangeState) this.props.onChangeState(event.nativeEvent);
  };

  _onChangeQuality = event => {
    if (this.props.onChangeQuality) this.props.onChangeQuality(event.nativeEvent);
  };

  _onChangeFullscreen = event => {
    const { isFullscreen } = event.nativeEvent;
    if (this.state.fullscreen !== isFullscreen) this.setState({ fullscreen: isFullscreen });
    if (this.props.onChangeFullscreen) this.props.onChangeFullscreen(event.nativeEvent);
  };

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
        .catch(errorMessage => reject(errorMessage)),
    );
  }

  currentTime() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeModule
        .currentTime(ReactNative.findNodeHandle(this._nativeComponentRef))
        .then(currentTime => resolve(currentTime))
        .catch(errorMessage => reject(errorMessage)),
    );
  }

  duration() {
    return new Promise((resolve, reject) =>
      NativeModules.YouTubeModule
        .duration(ReactNative.findNodeHandle(this._nativeComponentRef))
        .then(duration => resolve(duration))
        .catch(errorMessage => reject(errorMessage)),
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <RCTYouTube
          ref={component => {
            this._nativeComponentRef = component;
          }}
          {...this.props}
          fullscreen={this.state.fullscreen}
          style={[styles.module, { margin: this.state.moduleMargin }]}
          onYouTubeError={this._onError}
          onYouTubeReady={this._onReady}
          onYouTubeChangeState={this._onChangeState}
          onYouTubeChangeQuality={this._onChangeQuality}
          onYouTubeChangeFullscreen={this._onChangeFullscreen}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  module: {
    flex: 1,
  },
});
