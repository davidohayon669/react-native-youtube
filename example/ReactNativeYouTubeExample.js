/**
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PixelRatio,
  Platform,
  Button,
  Dimensions,
} from 'react-native';
import YouTube, { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';

export default class ReactNativeYouTubeExample extends React.Component {
  state = {
    isReady: false,
    currentVideoIndex: 0,
    videoIds: ['9PODnRarD78', 'umF1kfVujhM', '5pjKjncwFBw'],
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    isLooping: true,
    duration: 0,
    currentTime: 0,
    durationLabel: 'N/A',
    currentTimeLabel: 'N/A',
    videosIndexLabel: 'N/A',
    fullscreen: false,
    playerWidth: Dimensions.get('window').width,
  };

  _youTubeRef = React.createRef();

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>{'<YouTube /> component for React Native.'}</Text>

        {/* <YouTube
          ref={this._youTubeRef}
          // You must have an API Key for the player to load in Android
          apiKey="YOUR_API_KEY"
          // Un-comment one of videoId / videoIds / playlist.
          // You can also edit these props while Hot-Loading in development mode to see how
          // it affects the loaded native module
          // videoId="xuCn8ux2gbs"
          videoId="uMK0prafzw0"
          // videoIds={['uMK0prafzw0', 'qzYgSecGQww', 'XXlZfc1TrD0', 'czcjU1w-c6k']}
          style={[
            { height: PixelRatio.roundToNearestPixel(this.state.playerWidth / (16 / 9)) },
            styles.player,
          ]}
        /> */}

        <YouTube
          ref={this._youTubeRef}
          // You must have an API Key for the player to load in Android
          apiKey="YOUR_API_KEY"
          // Un-comment one of videoId / videoIds / playlist.
          // You can also edit these props while Hot-Loading in development mode to see how
          // it affects the loaded native module
          // videoId="xuCn8ux2gbs"
          // videoId={this.state.videoIds[this.state.currentVideoIndex]}
          videoIds={['uMK0prafzw0', 'qzYgSecGQww', 'XXlZfc1TrD0', '8bdeizHM9OU']}
          // videoId="PLF797E961509B4EB5"
          play={this.state.isPlaying}
          loop={this.state.isLooping}
          fullscreen={this.state.fullscreen}
          controls={1}
          style={[
            { height: PixelRatio.roundToNearestPixel(this.state.playerWidth / (16 / 9)) },
            styles.player,
          ]}
          onError={(e) => {
            this.setState({ error: e.error });
          }}
          onReady={(e) => {
            this.setState({ isReady: true });
          }}
          onChangeState={(e) => {
            console.log(e.state);
            if (e.state === 'playing') {
              this.setState({ isPlaying: true });
            } else if (e.state === 'paused') {
              this.setState({ isPlaying: false });
            }
            this.setState({ status: e.state });
          }}
          onChangeQuality={(e) => {
            this.setState({ quality: e.quality });
          }}
          onChangeFullscreen={(e) => {
            this.setState({ fullscreen: e.isFullscreen });
          }}
          onProgress={(e) => {
            this.setState({ currentTime: e.currentTime });
          }}
        />

        {/* Playing / Looping */}
        <View style={styles.buttonGroup}>
          <Button
            title={this.state.isPlaying ? 'Pause' : 'Play'}
            color={this.state.isPlaying ? 'red' : undefined}
            onPress={() => {
              this.setState((state) => ({ isPlaying: !state.isPlaying }));
            }}
          />
          <Text> </Text>
          <Button
            title={this.state.isLooping ? 'Looping' : 'Not Looping'}
            color={this.state.isLooping ? 'green' : undefined}
            onPress={() => {
              this.setState((state) => ({ isLooping: !state.isLooping }));
            }}
          />
          <Text> </Text>
          <Button
            title="Switch Video"
            onPress={() => {
              const currentVideoIndex =
                (this.state.currentVideoIndex + 1) % this.state.videoIds.length;

              this.setState({ currentVideoIndex });
            }}
          />
        </View>

        {/* Previous / Next video */}
        <View style={styles.buttonGroup}>
          <Button
            title="Previous Video"
            onPress={() => {
              if (this._youTubeRef.current) {
                this._youTubeRef.current.previousVideo();
              }
            }}
          />
          <Text> </Text>
          <Button
            title="Next Video"
            onPress={() => {
              if (this._youTubeRef.current) {
                this._youTubeRef.current.nextVideo();
              }
            }}
          />
        </View>

        {/* Go To Specific time in played video with seekTo() */}
        <View style={styles.buttonGroup}>
          <Button
            title="15 Seconds"
            onPress={() => {
              if (this._youTubeRef.current) {
                console.log(14.5);

                this._youTubeRef.current.seekTo(14.9);
              }
            }}
          />
          <Text> </Text>
          <Button
            title="2 Minutes"
            onPress={() => {
              if (this._youTubeRef.current) {
                this._youTubeRef.current.seekTo(2 * 60);
              }
            }}
          />
          <Text> </Text>
          <Button
            title="15 Minutes"
            onPress={() => {
              if (this._youTubeRef.current) {
                this._youTubeRef.current.seekTo(15 * 60);
              }
            }}
          />
        </View>

        {/* Play specific video in a videoIds array by index */}
        {this._youTubeRef.current &&
          this._youTubeRef.current.props.videoIds &&
          Array.isArray(this._youTubeRef.current.props.videoIds) && (
            <View style={styles.buttonGroup}>
              {this._youTubeRef.current.props.videoIds.map((videoId, i) => (
                <React.Fragment key={i}>
                  <Button
                    title={`Video ${i}`}
                    onPress={() => {
                      if (this._youTubeRef.current) {
                        this._youTubeRef.current.playVideoAt(i);
                      }
                    }}
                  />
                  <Text> </Text>
                </React.Fragment>
              ))}
            </View>
          )}

        {/* Get current played video's position index when playing videoIds (and playlist in iOS) */}
        <View style={styles.buttonGroup}>
          <Button
            title={'Get Videos Index: ' + this.state.videosIndexLabel}
            onPress={() => {
              if (this._youTubeRef.current) {
                this._youTubeRef.current
                  .getVideosIndex()
                  .then((videosIndexLabel) => {
                    this.setState({ videosIndexLabel });
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });
              }
            }}
          />
        </View>

        {/* Fullscreen */}
        {!this.state.fullscreen && (
          <View style={styles.buttonGroup}>
            <Button
              title="Set Fullscreen"
              onPress={() => {
                this.setState({ fullscreen: true });
              }}
            />
          </View>
        )}

        <View style={styles.buttonGroup}>
          <Button
            title={`Get Progress & Duration (${this.state.currentTimeLabel}/${this.state.durationLabel})`}
            onPress={() => {
              if (this._youTubeRef.current) {
                this._youTubeRef.current
                  .getCurrentTime()
                  .then((currentTimeLabel) => {
                    this.setState({ currentTimeLabel });
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });

                this._youTubeRef.current
                  .getDuration()
                  .then((durationLabel) => {
                    this.setState({ durationLabel });
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });
              }
            }}
          />
        </View>

        {/* Standalone Player (iOS) */}
        {Platform.OS === 'ios' && YouTubeStandaloneIOS && (
          <View style={styles.buttonGroup}>
            <Button
              title="Launch Standalone Player"
              onPress={() => {
                YouTubeStandaloneIOS.playVideo('KVZ-P-ZI6W4')
                  .then((message) => {
                    console.log(message);
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });
              }}
            />
          </View>
        )}

        {/* Standalone Player (Android) */}
        {Platform.OS === 'android' && YouTubeStandaloneAndroid && (
          <View style={styles.buttonGroup}>
            <Button
              style={styles.button}
              title="Standalone: One Video"
              onPress={() => {
                YouTubeStandaloneAndroid.playVideo({
                  apiKey: 'YOUR_API_KEY',
                  videoId: 'KVZ-P-ZI6W4',
                  autoplay: true,
                  lightboxMode: false,
                  startTime: 124.5,
                })
                  .then(() => {
                    console.log('Android Standalone Player Finished');
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });
              }}
            />
            <Text> </Text>
            <Button
              title="Videos"
              onPress={() => {
                YouTubeStandaloneAndroid.playVideos({
                  apiKey: 'YOUR_API_KEY',
                  videoIds: ['HcXNPI-IPPM', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0'],
                  autoplay: false,
                  lightboxMode: true,
                  startIndex: 1,
                  startTime: 99.5,
                })
                  .then(() => {
                    console.log('Android Standalone Player Finished');
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });
              }}
            />
            <Text> </Text>
            <Button
              title="Playlist"
              onPress={() => {
                YouTubeStandaloneAndroid.playPlaylist({
                  apiKey: 'YOUR_API_KEY',
                  playlistId: 'PLF797E961509B4EB5',
                  autoplay: false,
                  lightboxMode: false,
                  startIndex: 2,
                  startTime: 100.5,
                })
                  .then(() => {
                    console.log('Android Standalone Player Finished');
                  })
                  .catch((errorMessage) => {
                    this.setState({ error: errorMessage });
                  });
              }}
            />
          </View>
        )}

        {/* Reload iFrame for updated props (Only needed for iOS) */}
        {Platform.OS === 'ios' && (
          <View style={styles.buttonGroup}>
            <Button
              title="Reload iFrame (iOS)"
              onPress={() => {
                if (this._youTubeRef.current) {
                  this._youTubeRef.current.reloadIframe();
                }
              }}
            />
          </View>
        )}

        <Text style={styles.instructions}>
          {this.state.isReady ? 'Player is ready' : 'Player setting up...'}
        </Text>
        <Text style={styles.instructions}>Status: {this.state.status}</Text>
        <Text style={styles.instructions}>Quality: {this.state.quality}</Text>

        {/* Show Progress */}
        <Text style={styles.instructions}>
          Progress: {Math.trunc(this.state.currentTime)}s ({Math.trunc(this.state.duration / 60)}:
          {Math.trunc(this.state.duration % 60)}s)
          {Platform.OS !== 'ios' && <Text> (Click Update Progress & Duration)</Text>}
        </Text>

        <Text style={styles.instructions}>
          {this.state.error ? 'Error: ' + this.state.error : ''}
        </Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
        <Text>Haha</Text>
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
    paddingBottom: 5,
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
