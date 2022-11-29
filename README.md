# TrackPlayerRateExample
Shows react-native-track-player incorrectly resetting playback rate in some circumstances

# Installation
After cloning repo, `pod install` within the `ios` directory. Then open `ios/TrackPlayerRateTest.xcworkspace`, build, and run.

# Repro
1. Click `Toggle Rate` so that the playback rate goes to 2
2. Click `Play` to start listening to some fast audio
3. Now click `Forward 15s`

You'll notice the playback rate goes back to 1.0.

# Cause
It turns out the following sequence is problematic:
```typescript
  await TrackPlayer.setRate(2);
  await TrackPlayer.play();
  await TrackPlayer.seekTo(position + 15);
  await TrackPlayer.play();
```
Specifically, if you seek while playing, and then call `play()` in the new position, it'll reset the playback rate. I've not debugged into `SwiftAudioEx` enough to figure out the cause, but this is at least a reliable repro.
