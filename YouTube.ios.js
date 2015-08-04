var React = require('react-native');
var NativeModules = require('NativeModules');
var ReactIOSViewAttributes = require('ReactNativeViewAttributes');
var StyleSheet = require('StyleSheet');
var PropTypes = require('ReactPropTypes');
var StyleSheetPropType = require('StyleSheetPropType');
// var VideoResizeMode = require('./VideoResizeMode');
var ViewStylePropTypes = require('ViewStylePropTypes');
var NativeMethodsMixin = require('NativeMethodsMixin');
var flattenStyle = require('flattenStyle');
var merge = require('merge');
var deepDiffer = require('deepDiffer');
// var keyMirror = require('keyMirror');
var { requireNativeComponent, } = require('react-native');

// var YouTubeState = keyMirror({
//   contain: null,
//   cover: null,
//   stretch: null,
// });

// var YouTubeQuality = keyMirror({
//   contain: null,
//   cover: null,
//   stretch: null,
// });

// var YouTubeError = keyMirror({
//   contain: null,
//   cover: null,
//   stretch: null,
// });

var YouTube = React.createClass({
  propTypes: {
    style: StyleSheetPropType(ViewStylePropTypes),
    videoId: PropTypes.string.isRequired,
    playsInline: PropTypes.bool,
    play: PropTypes.bool,
    hidden: PropTypes.bool,
    onReady: PropTypes.func,
    onChangeState: PropTypes.func,
    onChangeQuality: PropTypes.func,
    onError: PropTypes.func,
  },

  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'UIView',
    validAttributes: ReactIOSViewAttributes.UIView
  },

  _onReady(event) {
    this.props.onReady && this.props.onReady(event.nativeEvent);
  },

  _onChangeState(event) {
    this.props.onChangeState && this.props.onChangeState(event.nativeEvent);
  },

  _onChangeQuality(event) {
    this.props.onChangeQuality && this.props.onChangeQuality(event.nativeEvent);
  },

  _onError(event) {
    this.props.onError && this.props.onError(event.nativeEvent);
  },


  seek(time) {
    this.setNativeProps({seek: parseFloat(time)});
  },

  render() {
    var style = flattenStyle([styles.base, this.props.style]);

    var nativeProps = merge(this.props, {
      style,
      onYoutubeVideoReady: this._onReady,
      onYoutubeVideoChangeState: this._onChangeState,
      onYoutubeVideoChangeQuality: this._onChangeQuality,
      onYoutubeVideoError: this._onError,
    });

    return <RCTYouTube {... nativeProps} />;
  },
});

var RCTYouTube = requireNativeComponent('RCTYouTube', null);

var styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

module.exports = YouTube;
