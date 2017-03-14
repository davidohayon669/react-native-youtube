/**
 * @providesModule YouTube
 */

import React from 'react';
import ReactNative, {
  View,
  Text,
  StyleSheet,
  requireNativeComponent,
  UIManager,
  NativeModules,
} from 'react-native';

const RCTYouTube = requireNativeComponent('ReactYouTube', YouTube, {
  nativeOnly: {
    onYouTubeError: true,
    onYouTubeErrorReady: true,
    onYouTubeErrorChangeState: true,
    onYouTubeErrorChangeQuality: true,
  },
});

export default class YouTube extends React.Component {
  static propTypes = {
    apiKey: React.PropTypes.string.isRequired,
    videoId: React.PropTypes.string,
    videoIds: React.PropTypes.arrayOf(React.PropTypes.string),
    playlistId: React.PropTypes.string,
    play: React.PropTypes.bool,
    loop: React.PropTypes.bool,
    playsInline: React.PropTypes.bool,
    controls: React.PropTypes.oneOf([0, 1, 2]),
    showFullscreenButton: React.PropTypes.bool,
    onError: React.PropTypes.func,
    onReady: React.PropTypes.func,
    onChangeState: React.PropTypes.func,
    onChangeQuality: React.PropTypes.func,
    style: View.propTypes.style,
  };

  static defaultProps = {
    showFullscreenButton: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      hiddenRenderText: 'o',
    };
    this._onError = this._onError.bind(this);
    this._onReady = this._onReady.bind(this);
    this._onChangeState = this._onChangeState.bind(this);
    this._onChangeQuality = this._onChangeQuality.bind(this);
  }

  _onError(event) {
    if (this.props.onError) this.props.onError(event.nativeEvent);
  }

  _onReady(event) {
    // Look at the JSX for info about this
    this.setState({ hiddenRenderText: 'x' });
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

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <RCTYouTube
          ref={component => {
            this._nativeComponentRef = component;
          }}
          {...this.props}
          style={styles.nativeModule}
          onYouTubeError={this._onError}
          onYouTubeReady={this._onReady}
          onYouTubeChangeState={this._onChangeState}
          onYouTubeChangeQuality={this._onChangeQuality}
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
