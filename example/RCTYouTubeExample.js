import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  Dimensions,
  Platform,
} from 'react-native';
import YouTube, { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';

export default class RCTYouTubeExample extends React.Component {
  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    isLooping: true,
    duration: 0,
    currentTime: 0,
    fullscreen: false,
    containerMounted: false,
    containerWidth: null,
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        onLayout={({ nativeEvent: { layout: { width } } }) => {
          if (!this.state.containerMounted) this.setState({ containerMounted: true });
          if (this.state.containerWidth !== width) this.setState({ containerWidth: width });
        }}
      >
        <Text style={styles.welcome}>
          {'<YouTube /> component for\n React Native.'}
        </Text>
        <Text style={styles.instructions}>
          http://github.com/inProgress-team/react-native-youtube
        </Text>

        {this.state.containerMounted &&
          <YouTube
            ref={component => {
              this._youTubeRef = component;
            }}
            // You must have an API Key for the player to load in Android
            apiKey="YOUR_API_KEY"
            // Un-comment one of videoId / videoIds / playlist.
            // You can also edit these props while Hot-Loading in development mode to see how
            // it affects the loaded native module
            videoId="ncw4ISEU5ik"
            // videoIds={['HcXNPI-IPPM', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0']}
            // playlistId="PLF797E961509B4EB5"
            play={this.state.isPlaying}
            loop={this.state.isLooping}
            fullscreen={this.state.fullscreen}
            controls={1}
            style={[
              { height: PixelRatio.roundToNearestPixel(this.state.containerWidth / (16 / 9)) },
              styles.player,
            ]}
            onError={e => this.setState({ error: e.error })}
            onReady={e => this.setState({ isReady: true })}
            onChangeState={e => this.setState({ status: e.state })}
            onChangeQuality={e => this.setState({ quality: e.quality })}
            onChangeFullscreen={e => this.setState({ fullscreen: e.isFullscreen })}
            onProgress={e => this.setState({ duration: e.duration, currentTime: e.currentTime })}
          />}

        {/* Playing / Looping */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState(s => ({ isPlaying: !s.isPlaying }))}
          >
            <Text style={styles.buttonText}>
              {this.state.status == 'playing' ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState(s => ({ isLooping: !s.isLooping }))}
          >
            <Text style={styles.buttonText}>
              {this.state.isLooping ? 'Looping' : 'Not Looping'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Previous / Next video */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this._youTubeRef && this._youTubeRef.previousVideo()}
          >
            <Text style={styles.buttonText}>Previous Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this._youTubeRef && this._youTubeRef.nextVideo()}
          >
            <Text style={styles.buttonText}>Next Video</Text>
          </TouchableOpacity>
        </View>

        {/* Go To Specific time in played video with seekTo() */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this._youTubeRef && this._youTubeRef.seekTo(15)}
          >
            <Text style={styles.buttonText}>15 Seconds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this._youTubeRef && this._youTubeRef.seekTo(2 * 60)}
          >
            <Text style={styles.buttonText}>2 Minutes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this._youTubeRef && this._youTubeRef.seekTo(15 * 60)}
          >
            <Text style={styles.buttonText}>15 Minutes</Text>
          </TouchableOpacity>
        </View>

        {/* Play specific video in a videoIds array by index */}
        {this._youTubeRef &&
          this._youTubeRef.props.videoIds &&
          Array.isArray(this._youTubeRef.props.videoIds) &&
          <View style={styles.buttonGroup}>
            {this._youTubeRef.props.videoIds.map((videoId, i) =>
              <TouchableOpacity
                key={i}
                style={styles.button}
                onPress={() => this._youTubeRef && this._youTubeRef.playVideoAt(i)}
              >
                <Text style={[styles.buttonText, styles.buttonTextSmall]}>{`Video ${i}`}</Text>
              </TouchableOpacity>,
            )}
          </View>}

        {/* Get current played video's position index when playing videoIds (and playlist in iOS) */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this._youTubeRef &&
              this._youTubeRef
                .videosIndex()
                .then(index => this.setState({ videosIndex: index }))
                .catch(errorMessage => this.setState({ error: errorMessage }))}
          >
            <Text style={styles.buttonText}>
              Get Videos Index: {this.state.videosIndex}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fullscreen */}
        {!this.state.fullscreen &&
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ fullscreen: true })}
            >
              <Text style={styles.buttonText}>Set Fullscreen</Text>
            </TouchableOpacity>
          </View>}

        {/* Update Progress & Duration (Android) */}
        {Platform.OS === 'android' &&
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (this._youTubeRef) {
                  this._youTubeRef
                    .currentTime()
                    .then(currentTime => this.setState({ currentTime }))
                    .catch(errorMessage => this.setState({ error: errorMessage }));
                  this._youTubeRef
                    .duration()
                    .then(duration => this.setState({ duration }))
                    .catch(errorMessage => this.setState({ error: errorMessage }));
                }
              }}
            >
              <Text style={styles.buttonText}>Update Progress & Duration (Android)</Text>
            </TouchableOpacity>
          </View>}

        {/* Standalone Player (iOS) */}
        {Platform.OS === 'ios' &&
          YouTubeStandaloneIOS &&
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                YouTubeStandaloneIOS.playVideo('KVZ-P-ZI6W4')
                  .then(() => console.log('iOS Standalone Player Finished'))
                  .catch(errorMessage => this.setState({ error: errorMessage }))}
            >
              <Text style={styles.buttonText}>Launch Standalone Player</Text>
            </TouchableOpacity>
          </View>}

        {/* Standalone Player (Android) */}
        {Platform.OS === 'android' &&
          YouTubeStandaloneAndroid &&
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                YouTubeStandaloneAndroid.playVideo({
                  apiKey: 'YOUR_API_KEY',
                  videoId: 'KVZ-P-ZI6W4',
                  autoplay: true,
                  lightboxMode: false,
                  startTime: 124.5,
                })
                  .then(() => console.log('Android Standalone Player Finished'))
                  .catch(errorMessage => this.setState({ error: errorMessage }))}
            >
              <Text style={styles.buttonText}>Standalone: One Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                YouTubeStandaloneAndroid.playVideos({
                  apiKey: 'YOUR_API_KEY',
                  videoIds: ['HcXNPI-IPPM', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0'],
                  autoplay: false,
                  lightboxMode: true,
                  startIndex: 1,
                  startTime: 99.5,
                })
                  .then(() => console.log('Android Standalone Player Finished'))
                  .catch(errorMessage => this.setState({ error: errorMessage }))}
            >
              <Text style={styles.buttonText}>Videos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                YouTubeStandaloneAndroid.playPlaylist({
                  apiKey: 'YOUR_API_KEY',
                  playlistId: 'PLF797E961509B4EB5',
                  autoplay: false,
                  lightboxMode: false,
                  startIndex: 2,
                  startTime: 100.5,
                })
                  .then(() => console.log('Android Standalone Player Finished'))
                  .catch(errorMessage => this.setState({ error: errorMessage }))}
            >
              <Text style={styles.buttonText}>Playlist</Text>
            </TouchableOpacity>
          </View>}

        {/* Reload iFrame for updated props (Only needed for iOS) */}
        {Platform.OS === 'ios' &&
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this._youTubeRef && this._youTubeRef.reloadIframe()}
            >
              <Text style={styles.buttonText}>Reload iFrame (iOS)</Text>
            </TouchableOpacity>
          </View>}

        <Text style={styles.instructions}>
          {this.state.isReady ? 'Player is ready' : 'Player setting up...'}
        </Text>
        <Text style={styles.instructions}>
          Status: {this.state.status}
        </Text>
        <Text style={styles.instructions}>
          Quality: {this.state.quality}
        </Text>

        {/* Show Progress */}
        <Text style={styles.instructions}>
          Progress: {Math.trunc(this.state.currentTime)}s ({Math.trunc(this.state.duration / 60)}:{Math.trunc(this.state.duration % 60)}s)
          {Platform.OS !== 'ios' && <Text> (Click Update Progress & Duration)</Text>}
        </Text>

        <Text style={styles.instructions}>
          {this.state.error ? 'Error: ' + this.state.error : ''}
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
  buttonTextSmall: {
    fontSize: 15,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  player: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
});
