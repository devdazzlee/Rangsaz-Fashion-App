import React, { useEffect } from 'react';
import { Image, StyleSheet, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));

    dot1.value = withDelay(0, withRepeat(withTiming(1, { duration: 600 }), -1, true));
    dot2.value = withDelay(200, withRepeat(withTiming(1, { duration: 600 }), -1, true));
    dot3.value = withDelay(400, withRepeat(withTiming(1, { duration: 600 }), -1, true));

    const timer = setTimeout(() => {
      const isLoggedIn = false; // TODO: real auth check
      navigation.replace(isLoggedIn ? 'Home' : 'Login');
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: 0.8 + dot1.value * 0.4 }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: 0.8 + dot2.value * 0.4 }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: 0.8 + dot3.value * 0.4 }],
  }));

  return (
    <LinearGradient
      colors={['#ffffff', '#faf8f3', '#ffffff']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.tagline, taglineStyle]}>
        DRESSES THAT INSPIRE
      </Animated.Text>

      <Animated.View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, dot1Style]} />
        <Animated.View style={[styles.dot, dot2Style]} />
        <Animated.View style={[styles.dot, dot3Style]} />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoWrapper: { alignItems: 'center' },
  logo: { width: 280, height: 110 },
  tagline: {
    marginTop: 18,
    color: '#C9A227',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9A227',
  },
});

export default SplashScreen;