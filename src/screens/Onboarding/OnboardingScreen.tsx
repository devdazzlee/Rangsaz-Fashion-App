import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  TouchableOpacity, StatusBar, FlatList,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withSpring, withSequence, withRepeat,
  Easing, interpolate, useAnimatedScrollHandler,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');
const GOLD = '#C9A227';
const DARK = '#0d0d0d';

// ── Slide data ────────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    emoji: '👗',
    emojisBg: ['🌸', '✨', '🧵', '💫', '🌺'],
    title: 'Dresses That\nInspire',
    subtitle:
      'Discover Pakistan\'s finest fashion — from elegant lawn suits to stunning bridal collections, all in one place.',
    bg: '#0d0d0d',
    accent: GOLD,
    btnLabel: 'Next',
  },
  {
    id: '2',
    emoji: '🛍️',
    emojisBg: ['💳', '🚚', '📦', '✅', '🎁'],
    title: 'Shop with\nConfidence',
    subtitle:
      'Enjoy free delivery, easy returns, and secure payments. Your satisfaction is our top priority.',
    bg: '#1a0f00',
    accent: GOLD,
    btnLabel: 'Next',
  },
  {
    id: '3',
    emoji: '💎',
    emojisBg: ['👑', '🌟', '💐', '🎀', '✨'],
    title: 'Exclusive\nOffers Await',
    subtitle:
      'Join thousands of happy customers and unlock exclusive deals, early access to new collections, and more.',
    bg: '#0a0a1a',
    accent: GOLD,
    btnLabel: 'Get Started',
  },
];

// ── Floating emoji decoration ─────────────────────────────
const FloatingEmoji = ({
  emoji,
  index,
}: {
  emoji: string;
  index: number;
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const positions = [
    { top: '15%', left: '8%'  },
    { top: '25%', right: '10%' },
    { top: '55%', left: '5%'  },
    { top: '65%', right: '8%' },
    { top: '40%', left: '80%' },
  ];

  useEffect(() => {
    const delay = index * 150;
    opacity.value = withDelay(delay, withTiming(0.35, { duration: 600 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 1800 + index * 300, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1800 + index * 300, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const pos = positions[index] || { top: '50%', left: '50%' };

  return (
    <Animated.Text style={[styles.floatingEmoji, pos, style]}>
      {emoji}
    </Animated.Text>
  );
};

// ── Single slide ──────────────────────────────────────────
const Slide = ({
  item,
  index,
  scrollX,
}: {
  item: typeof SLIDES[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const emojiScale = useSharedValue(0);
  const emojiRotate = useSharedValue(-15);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    emojiScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 120 }));
    emojiRotate.value = withDelay(200, withSpring(0, { damping: 12 }));
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(400, withTiming(0, { duration: 500 }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: emojiScale.value },
      { rotate: `${emojiRotate.value}deg` },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  // Parallax effect on emoji
  const parallaxStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-width * 0.3, 0, width * 0.3],
    );
    return { transform: [{ translateX }] };
  });

  return (
    <View style={[styles.slide, { backgroundColor: item.bg }]}>
      {/* Floating bg emojis */}
      {item.emojisBg.map((e, i) => (
        <FloatingEmoji key={i} emoji={e} index={i} />
      ))}

      {/* Gold circle glow */}
      <View style={styles.glowCircle} />

      {/* Main emoji */}
      <Animated.View style={[styles.mainEmojiWrapper, parallaxStyle]}>
        <Animated.View style={[styles.mainEmojiCircle, emojiStyle]}>
          <Text style={styles.mainEmoji}>{item.emoji}</Text>
        </Animated.View>
      </Animated.View>

      {/* Text content */}
      <View style={styles.slideTextBox}>
        <Animated.Text style={[styles.slideTitle, titleStyle]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.slideSubtitle, subtitleStyle]}>
          {item.subtitle}
        </Animated.Text>
      </View>
    </View>
  );
};

// ── Dot indicator ─────────────────────────────────────────
const DotIndicator = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: total }).map((_, i) => {
      const isActive = i === current;
      return (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            isActive && styles.dotActive,
          ]}
        />
      );
    })}
  </View>
);

// ── Main Screen ───────────────────────────────────────────
const OnboardingScreen = ({ navigation }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const btnScale = useSharedValue(1);
  const skipOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const dotsOpacity = useSharedValue(0);

  useEffect(() => {
    skipOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    btnOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    dotsOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, []);

  const skipStyle = useAnimatedStyle(() => ({ opacity: skipOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ scale: btnScale.value }],
  }));
  const dotsStyle = useAnimatedStyle(() => ({ opacity: dotsOpacity.value }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const handleNext = async () => {
    btnScale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withTiming(1, { duration: 120 }),
    );

    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      await handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('Login');
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={SLIDES[currentIndex].bg} />

      {/* Skip button */}
      {!isLastSlide && (
        <Animated.View style={[styles.skipWrapper, skipStyle]}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom controls */}
      <View
        style={[
          styles.bottomControls,
          { backgroundColor: SLIDES[currentIndex].bg },
        ]}
      >
        {/* Dots */}
        <Animated.View style={dotsStyle}>
          <DotIndicator total={SLIDES.length} current={currentIndex} />
        </Animated.View>

        {/* Next / Get Started button */}
        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <TouchableOpacity
            style={[
              styles.nextBtn,
              isLastSlide && styles.nextBtnLast,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.nextBtnText,
              isLastSlide && styles.nextBtnTextLast,
            ]}>
              {SLIDES[currentIndex].btnLabel}
            </Text>
            {!isLastSlide && (
              <Text style={styles.nextArrow}> →</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Already have account */}
        {isLastSlide && (
          <Animated.View style={[styles.loginRow, skipStyle]}>
            <Text style={styles.loginRowText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.loginRowLink}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK },

  // Skip
  skipWrapper: { position: 'absolute', top: 52, right: 20, zIndex: 10 },
  skipBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  skipText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  // Slide
  slide: { width, height: height * 0.78, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  // Floating emojis
  floatingEmoji: { position: 'absolute', fontSize: 26 },

  // Glow
  glowCircle: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: GOLD, opacity: 0.07, top: '20%' },

  // Main emoji
  mainEmojiWrapper: { marginBottom: 40 },
  mainEmojiCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(201,162,39,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(201,162,39,0.3)' },
  mainEmoji: { fontSize: 80 },

  // Text
  slideTextBox: { paddingHorizontal: 32, alignItems: 'center' },
  slideTitle: { fontSize: 36, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 44, marginBottom: 16, letterSpacing: -0.5 },
  slideSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 24 },

  // Bottom controls
  bottomControls: { paddingHorizontal: 28, paddingBottom: 48, paddingTop: 20, alignItems: 'center', gap: 20 },

  // Dots
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 24, backgroundColor: GOLD, borderRadius: 4 },

  // Button
  btnWrapper: { width: '100%' },
  nextBtn: { backgroundColor: GOLD, borderRadius: 16, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: GOLD, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
  nextBtnLast: { backgroundColor: '#fff' },
  nextBtnText: { fontSize: 15, fontWeight: '800', color: DARK, letterSpacing: 1 },
  nextBtnTextLast: { color: DARK },
  nextArrow: { fontSize: 16, fontWeight: '800', color: DARK },

  // Login row
  loginRow: { flexDirection: 'row', alignItems: 'center' },
  loginRowText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  loginRowLink: { fontSize: 13, fontWeight: '800', color: GOLD },
});

export default OnboardingScreen;