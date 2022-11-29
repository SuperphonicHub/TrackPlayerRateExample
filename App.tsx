/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState, type PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import TrackPlayer, {Capability, useProgress} from 'react-native-track-player';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [rate, setRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const {position, duration} = useProgress(1000);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    async function initPlayer() {
      await TrackPlayer.setupPlayer();
      await updateOptions();
      await TrackPlayer.setRate(rate);
      await TrackPlayer.add({
        url: 'https://mcdn.podbean.com/mf/web/txchqy/Prelude.mp3',
        title: 'Peak Salvation Prelude',
        artist: 'Spark Anvil, LLC',
        album: 'Peak Salvation',
      });
    }

    initPlayer();
  }, []);

  async function updateOptions() {
    const base: Capability[] = [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.Skip,
    ];
    await TrackPlayer.updateOptions({capabilities: base});
  }

  async function onRateToggle() {
    const newRate = rate === 1 ? 2 : 1;

    await TrackPlayer.setRate(newRate);
    setRate(newRate);
  }

  async function onPlayPause() {
    if (playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }

    setPlaying(!playing);
  }

  async function onSeek(secs: number) {
    const target = Math.max(0, Math.min(position + secs, duration));
    await TrackPlayer.seekTo(target);

    // This is the critical line. If you're already playing at 2x, then calling
    // Play again will reduce you down to 1x.
    await TrackPlayer.play();
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text>Play Rate Test</Text>
      <View style={styles.block}>
        <Text>{`Current play rate: ${rate}`}</Text>
        <Button onPress={onRateToggle} title="Toggle Rate" />
      </View>
      <View style={styles.block}>
        <Text>{`Currently ${playing ? 'playing' : 'paused'} at ${Math.round(
          position,
        )}/${Math.round(duration)}`}</Text>
        <Button onPress={onPlayPause} title={playing ? 'Pause' : 'Play'} />
      </View>
      <View style={styles.block}>
        <Button onPress={updateOptions} title="Update Options" />
      </View>
      <View style={styles.block}>
        <Text>Seek a Bit</Text>
        <Button onPress={() => onSeek(-15)} title="Backward 15s" />
        <Button onPress={() => onSeek(15)} title="Forward 15s" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  block: {
    marginBottom: 12,
  },
});

export default App;
