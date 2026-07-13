import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSuccess'>;

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const OrderSuccessScreen = ({ navigation }: Props) => {
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(30);
  const btnOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    checkScale.value = withDelay(
      200,
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    checkOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    ringScale.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800 }),
          withTiming(1, { duration: 800 }),
        ),
        -1,
        false,
      ),
    );
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(600, withTiming(0, { duration: 500 }));
    cardOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    cardY.value = withDelay(800, withTiming(0, { duration: 500 }));
    btnOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Success icon */}
      <View style={styles.iconSection}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.checkCircle, checkStyle]}>
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.View style={[styles.titleSection, titleStyle]}>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with Rangsaz Fashion.{'\n'}
          Your order is being processed.
        </Text>
      </Animated.View>

      {/* Order info card */}
      <Animated.View style={[styles.orderCard, cardStyle]}>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Order ID</Text>
          <Text style={styles.orderValue}>
            #RF-{Math.floor(Math.random() * 90000) + 10000}
          </Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Estimated Delivery</Text>
          <Text style={styles.orderValue}>3–5 Business Days</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Payment</Text>
          <Text style={[styles.orderValue, { color: '#2e7d32' }]}>
            Confirmed ✓
          </Text>
        </View>
        <View style={[styles.orderRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.orderLabel}>Total Paid</Text>
          <Text
            style={[
              styles.orderValue,
              { color: GOLD, fontSize: 16, fontWeight: '800' },
            ]}
          >
            PKR 12,900
          </Text>
        </View>
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.btnSection, btnStyle]}>
        <TouchableOpacity
          style={styles.trackBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('OrderTracking', { orderId: 'RF-52847' })
          }
        >
          <Text style={styles.trackBtnText}>TRACK MY ORDER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.85}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.homeBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: GOLD,
    opacity: 0.3,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: GOLD,
  },
  checkIcon: { fontSize: 36, color: GOLD, fontWeight: '800' },
  titleSection: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', color: DARK, marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#faf8f3',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0e8cc',
    marginBottom: 32,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e8cc',
  },
  orderLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  orderValue: { fontSize: 13, fontWeight: '700', color: DARK },
  btnSection: { width: '100%', gap: 12 },
  trackBtn: {
    backgroundColor: DARK,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  trackBtnText: {
    color: GOLD,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
  },
  homeBtn: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeBtnText: { color: '#666', fontWeight: '600', fontSize: 14 },
});

export default OrderSuccessScreen;
