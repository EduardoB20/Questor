import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoFinal() {
  const player = useVideoPlayer(require('../../assets/videos/money-animation.mp4'), (video) => {
    video.loop = true;
    video.muted = true;
    video.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 550,
    aspectRatio: 16 / 9,
    backgroundColor: '#303032',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
