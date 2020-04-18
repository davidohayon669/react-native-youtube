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
    resumePlayAndroid: PropTypes.bool,
    onError: PropTypes.func,
    onReady: PropTypes.func,
    onChangeState: PropTypes.func,
    onChangeQuality: PropTypes.func,
    onChangeFullscreen: PropTypes.func,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    showFullscreenButton: true,
    resumePlayAndroid: true,
  };

  _interval = null;

  _nativeComponentRef = React.createRef();

  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', this._backPress);

    this.state = {
      fullscreen: props.fullscreen,
      resizingHackFlag: false,
    };
  }

  componentDidMount() {
    // Make sure the Loading indication is displayed so use this hack before the video loads
    this._fireResizingHack();
  }

  componentDidUpdate(prevProps) {
    // Translate next `fullscreen` prop to state
    if (prevProps.fullscreen !== this.props.fullscreen) {
      this.setState({ fullscreen: this.props.fullscreen });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backPress);

    clearInterval(this._timeout);
  }

  // The Android YouTube native module is pretty problematic when it comes to mounting correctly
  // and rendering inside React-Native's views hierarchy. For now we must trigger some layout
  // changes to force a real render on it so it will respotision it's controls after several
  // specific events
  _fireResizingHack() {
    clearInterval(this._timeout);

    let wait = 0.2;

    const next = () => {
      this.setState((state) => ({ resizingHackFlag: !state.resizingHackFlag }));

      wait = wait >= 1.5 ? 1.5 : wait * 1.4;
      this._timeout = setTimeout(next, wait * 1000);
    };

    next();
  }

  _backPress = () => {
    if (this.state.fullscreen) {
      this.setState({ fullscreen: false });

      return true;
    }

    return false;
  };

  _onLayout = () => {
    // When the Native player changes it's layout, we should also force a resizing hack to make
    // sure the controls are in their correct place
    this._fireResizingHack();
  };

  _onError = (event) => {
    if (this.props.onError) {
      this.props.onError(event.nativeEvent);
    }
  };

  _onReady = (event) => {
    this._fireResizingHack();

    if (this.props.onReady) {
      this.props.onReady(event.nativeEvent);
    }
  };

  _onChangeState = (event) => {
    if (this.props.onChangeState) {
      this.props.onChangeState(event.nativeEvent);
    }
  };

  _onChangeQuality = (event) => {
    if (this.props.onChangeQuality) {
      this.props.onChangeQuality(event.nativeEvent);
    }
  };

  _onChangeFullscreen = (event) => {
    const { isFullscreen } = event.nativeEvent;
    if (this.state.fullscreen !== isFullscreen) {
      this.setState({ fullscreen: isFullscreen });
    }

    if (this.props.onChangeFullscreen) {
      this.props.onChangeFullscreen(event.nativeEvent);
    }
  };

  seekTo(seconds) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
      UIManager.getViewManagerConfig('ReactYouTube').Commands.seekTo,
      [parseInt(seconds, 10)],
    );
  }

  nextVideo() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
      UIManager.getViewManagerConfig('ReactYouTube').Commands.nextVideo,
      [],
    );
  }

  previousVideo() {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
      UIManager.getViewManagerConfig('ReactYouTube').Commands.previousVideo,
      [],
    );
  }

  playVideoAt(index) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
      UIManager.getViewManagerConfig('ReactYouTube').Commands.playVideoAt,
      [parseInt(index, 10)],
    );
  }

  getVideosIndex = () =>
    NativeModules.YouTubeModule.getVideosIndex(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
    );

  getCurrentTime = () =>
    NativeModules.YouTubeModule.getCurrentTime(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
    );

  getDuration = () =>
    NativeModules.YouTubeModule.getDuration(
      ReactNative.findNodeHandle(this._nativeComponentRef.current),
    );

  render() {
    return (
      <View onLayout={this._onLayout} style={[styles.container, this.props.style]}>
        <RCTYouTube
          ref={this._nativeComponentRef}
          {...this.props}
          fullscreen={this.state.fullscreen}
          style={[
            styles.module,
            { marginRight: this.state.resizingHackFlag ? StyleSheet.hairlineWidth : 0 },
          ]}
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
