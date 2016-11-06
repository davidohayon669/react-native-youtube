import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  Dimensions,
} from 'react-native';
import YouTube from 'react-native-youtube';

class RCTYouTubeExample extends React.Component {

  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>
          {"<Youtube /> component for\n React Native."}
        </Text>
        <Text style={styles.instructions}>
          http://github.com/inProgress-team/react-native-youtube
        </Text>

        <YouTube
          ref={(component) => { this._youTubeRef = component }}
          // You must have an apiKey for the player to load in Android. Prop is ignored in iOS
          // apiKey=""
          // Un-comment one of videoId / videoIds / playlist.
          // You can also play with these props while Hot-Loading in development to see how
          // it affect a loaded native module
          videoId="KVZ-P-ZI6W4"
          // videoIds={['HcXNPI-IPPM', 'uLyhb5iG-5g', 'XXlZfc1TrD0', 'zV2aYno9xGc']}
          // playlist="PLF797E961509B4EB5"
          play={this.state.isPlaying}
          loop={true}
          hidden={false}
          playsInline={true}
          style={styles.player}
          onReady={e => this.setState({ isReady: true })}
          onChangeState={e => this.setState({ status: e.state })}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onProgress={e => this.setState({ progress: e.progress })}
          onError={e => this.setState({ error: e.error })}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.setState(s => ({ isPlaying: !s.isPlaying }))}
        >
          <Text style={styles.buttonText}>
            {this.state.status == 'playing' ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        {/* Previous / Next video (Ignored when only one video) */}
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
        {this.props.videoIds && Array.isArray(this.props.videoIds) &&
          <View style={styles.buttonGroup}>
            {this.props.videoIds.map((videoId, i) => (
              <TouchableOpacity
                key={i}
                style={styles.button}
                onPress={() => this._youTubeRef && this._youTubeRef.playVideoAt(i)}
              >
                <Text style={[styles.buttonText, styles.buttonTextSmall]}>{`Video ${i}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }

        {/* Go To Specific time in played video with seekTo() */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={
              () => this._youTubeRef && this._youTubeRef.playlistIndex()
                .then(index => this.setState({ playlistIndex: index }))
                .catch(errorMessage => this.setState({ error: errorMessage }))
            }
          >
            <Text style={styles.buttonText}>Get Playlist Index: {this.state.playlistIndex}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>{this.state.isReady ? 'Player is ready.' : 'Player setting up...'}</Text>
        <Text style={styles.instructions}>Status: {this.state.status}</Text>
        <Text style={styles.instructions}>Quality: {this.state.quality}</Text>
        <Text style={styles.instructions}>Progress: {this.state.progress}</Text>
        <Text style={styles.instructions}>{this.state.error ? 'Error: ' + this.state.error : ' '}</Text>

      </ScrollView>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flex: 1,
    backgroundColor: '#F5FCFF',
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
    height: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9)),
    alignSelf: 'stretch',
    backgroundColor: 'black',
    marginVertical: 10,
  },
});

AppRegistry.registerComponent('RCTYouTubeExample', () => RCTYouTubeExample);
