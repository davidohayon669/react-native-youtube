/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var YouTube = require('react-native-youtube');

var RCTYouTubeExample = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <YouTube
          videoId="Rpy24sRo3Cc"
          play={true}
          hidden={false}
          playsInline={true}
          onReady={(e)=>{console.log(e)}}
          onChangeState={(e)=>{console.log(e)}}
          onChangeQuality={(e)=>{console.log(e)}}
          onError={(e)=>{console.log(e)}}
          style={{width: 300, height: 300, backgroundColor: 'black'}}
        />
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RCTYouTubeExample', () => RCTYouTubeExample);
