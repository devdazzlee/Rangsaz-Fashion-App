import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withSpring, withSequence, withRepeat,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const DARK = '#0d0d0d';
const GREEN = '#2e7d32';

// ── Types ────────────────────────────────────────────────
type StepStatus = 'done' | 'active' | 'pending';

interface TrackingStep {
  id: string;
  label: string;
  subLabel: string;
  icon: string;
  time: string;
  date: string;
  status: StepStatus;
}

// ── Data ─────────────────────────────────────────────────
const TRACKING_STEPS: TrackingStep[] = [
  {
    id: '1',
    label: 'Order Placed',
    subLabel: 'Your order has been received',
    icon: '🛍️',
    time: '10:32 AM',
    date: 'Today',
    status: 'done',
  },
  {
    id: '2',
    label: 'Order Confirmed',
    subLabel: 'Seller has confirmed your order',
    icon: '✅',
    time: '11:05 AM',
    date: 'Today',
    status: 'done',
  },
  {
    id: '3',
    label: 'Being Prepared',
    subLabel: 'Your order is being packed',
    icon: '📦',
    time: '02:15 PM',
    date: 'Today',
    status: 'active',
  },
  {
    id: '4',
    label: 'Out for Delivery',
    subLabel: 'Rider is on the way',
    icon: '🚚',
    time: 'Expected',
    date: 'Tomorrow',
    status: 'pending',
  },
  {
    id: '5',
    label: 'Delivered',
    subLabel: 'Package delivered successfully',
    icon: '🎉',
    time: 'Expected',
    date: 'In 3–5 days',
    status: 'pending',
  },
];

const ORDER_ITEMS = [
  { id: '1', name: 'Zari Embroidered Suit', price: 'PKR 8,500', emoji: '👗', qty: 1 },
  { id: '2', name: 'Silk Dupatta',          price: 'PKR 4,400', emoji: '🧤', qty: 2 },
];

// ── Animated Step ─────────────────────────────────────────
const TrackingStepItem = ({
  step,
  index,
  isLast,
}: {
  step: TrackingStep;
  index: number;
  isLast: boolean;
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-40);
  const iconScale = useSharedValue(0);
  const lineHeight = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    const delay = index * 200;

    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
    iconScale.value = withDelay(delay + 200, withSpring(1, { damping: 12, stiffness: 150 }));

    if (!isLast) {
      lineHeight.value = withDelay(
        delay + 400,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
      );
    }

    // pulse for active step
    if (step.status === 'active') {
      pulseScale.value = withDelay(
        delay + 300,
        withRepeat(
          withSequence(
            withTiming(1.5, { duration: 800 }),
            withTiming(1, { duration: 800 }),
          ),
          -1,
          false,
        ),
      );
      pulseOpacity.value = withDelay(
        delay + 300,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 800 }),
            withTiming(0.6, { duration: 800 }),
          ),
          -1,
          false,
        ),
      );
    }
  }, []);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: lineHeight.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const isDone = step.status === 'done';
  const isActive = step.status === 'active';
  const isPending = step.status === 'pending';

  return (
    <Animated.View style={[styles.stepRow, rowStyle]}>
      {/* Left: circle + line */}
      <View style={styles.stepLeft}>
        {/* Pulse ring for active */}
        {isActive && (
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
        )}

        {/* Icon circle */}
        <Animated.View style={[
          styles.stepCircle,
          isDone && styles.stepCircleDone,
          isActive && styles.stepCircleActive,
          isPending && styles.stepCirclePending,
          iconStyle,
        ]}>
          {isDone
            ? <Text style={styles.stepCheckmark}>✓</Text>
            : <Text style={styles.stepIcon}>{step.icon}</Text>
          }
        </Animated.View>

        {/* Vertical line */}
        {!isLast && (
          <View style={styles.lineWrapper}>
            <Animated.View style={[
              styles.line,
              isDone && styles.lineDone,
              isActive && styles.lineActive,
              lineStyle,
            ]} />
          </View>
        )}
      </View>

      {/* Right: content */}
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <View>
            <Text style={[
              styles.stepLabel,
              isPending && styles.stepLabelPending,
            ]}>
              {step.label}
            </Text>
            <Text style={styles.stepSubLabel}>{step.subLabel}</Text>
          </View>
          <View style={styles.stepTimeBox}>
            <Text style={[
              styles.stepTime,
              isDone && { color: GREEN },
              isActive && { color: GOLD },
            ]}>
              {step.time}
            </Text>
            <Text style={styles.stepDate}>{step.date}</Text>
          </View>
        </View>

        {/* Active step extra detail */}
        {isActive && (
          <View style={styles.activeDetail}>
            <View style={styles.activeDetailDot} />
            <Text style={styles.activeDetailText}>
              Estimated completion in 2–3 hours
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ── Map Tracker ───────────────────────────────────────────
const DeliveryMap = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const dotX = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    scale.value = withDelay(1200, withSpring(1, { damping: 14 }));
    dotX.value = withDelay(1600, withRepeat(
      withSequence(
        withTiming(width - 120, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    ));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dotX.value }],
  }));

  return (
    <Animated.View style={[styles.mapCard, cardStyle]}>
      <Text style={styles.mapTitle}>📍 Live Tracking</Text>
      <View style={styles.mapBox}>
        {/* Fake road */}
        <View style={styles.mapRoad} />
        {/* Start point */}
        <View style={[styles.mapPoint, styles.mapPointStart]}>
          <Text style={{ fontSize: 14 }}>🏪</Text>
        </View>
        {/* End point */}
        <View style={[styles.mapPoint, styles.mapPointEnd]}>
          <Text style={{ fontSize: 14 }}>🏠</Text>
        </View>
        {/* Moving rider dot */}
        <Animated.View style={[styles.riderDot, dotStyle]}>
          <Text style={{ fontSize: 16 }}>🛵</Text>
        </Animated.View>
      </View>
      <View style={styles.mapFooter}>
        <Text style={styles.mapEta}>🕐 Estimated arrival: Tomorrow by 6 PM</Text>
      </View>
    </Animated.View>
  );
};

// ── Main Screen ───────────────────────────────────────────
const OrderTrackingScreen = ({ route, navigation }: Props) => {
  const { orderId } = route.params;
  const [activeTab, setActiveTab] = useState<'tracking' | 'details'>('tracking');

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const tabOpacity = useSharedValue(0);
  const statusOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withTiming(0, { duration: 500 });
    tabOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    statusOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));
  const tabStyle = useAnimatedStyle(() => ({ opacity: tabOpacity.value }));
  const statusStyle = useAnimatedStyle(() => ({ opacity: statusOpacity.value }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <Text style={styles.headerOrderId}>#{orderId}</Text>
        </View>
        <TouchableOpacity style={styles.helpBtn}>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Status pill */}
      <Animated.View style={[styles.statusPillWrapper, statusStyle]}>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Being Prepared</Text>
        </View>
        <Text style={styles.statusEta}>Arriving in 3–5 days</Text>
      </Animated.View>

      {/* Tabs */}
      <Animated.View style={[styles.tabRow, tabStyle]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tracking' && styles.tabActive]}
          onPress={() => setActiveTab('tracking')}
        >
          <Text style={[styles.tabText, activeTab === 'tracking' && styles.tabTextActive]}>
            Tracking
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.tabActive]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
            Order Details
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'tracking' ? (
          <>
            {/* Map */}
            <DeliveryMap />

            {/* Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Order Timeline</Text>
              {TRACKING_STEPS.map((step, i) => (
                <TrackingStepItem
                  key={step.id}
                  step={step}
                  index={i}
                  isLast={i === TRACKING_STEPS.length - 1}
                />
              ))}
            </View>
          </>
        ) : (
          /* Order Details Tab */
          <View style={styles.detailsSection}>
            {/* Items */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>🛍️ Items Ordered</Text>
              {ORDER_ITEMS.map(item => (
                <View key={item.id} style={styles.orderItemRow}>
                  <View style={styles.orderItemImage}>
                    <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemQty}>Qty: {item.qty}</Text>
                  </View>
                  <Text style={styles.orderItemPrice}>{item.price}</Text>
                </View>
              ))}
            </View>

            {/* Delivery info */}
            <View style={[styles.detailCard, { marginTop: 12 }]}>
              <Text style={styles.detailCardTitle}>📍 Delivery Address</Text>
              <Text style={styles.detailText}>Raza Ahmed</Text>
              <Text style={styles.detailTextSub}>House 12, Block B, Gulshan-e-Iqbal</Text>
              <Text style={styles.detailTextSub}>Karachi, Sindh 75300</Text>
              <Text style={styles.detailTextSub}>📞 0300-1234567</Text>
            </View>

            {/* Price breakdown */}
            <View style={[styles.detailCard, { marginTop: 12 }]}>
              <Text style={styles.detailCardTitle}>🧾 Price Summary</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>PKR 12,900</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Shipping</Text>
                <Text style={[styles.priceValue, { color: GREEN }]}>FREE</Text>
              </View>
              <View style={[styles.priceRow, styles.priceTotalRow]}>
                <Text style={styles.priceTotalLabel}>Total Paid</Text>
                <Text style={styles.priceTotalValue}>PKR 12,900</Text>
              </View>
            </View>

            {/* Payment method */}
            <View style={[styles.detailCard, { marginTop: 12 }]}>
              <Text style={styles.detailCardTitle}>💳 Payment Method</Text>
              <Text style={styles.detailText}>💵  Cash on Delivery</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.contactBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.contactBtnText}>📞  Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shopBtn}
          activeOpacity={0.85}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.shopBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, fontWeight: '700', color: DARK },
  headerTitle: { fontSize: 16, fontWeight: '800', color: DARK, textAlign: 'center' },
  headerOrderId: { fontSize: 12, color: GOLD, fontWeight: '600', textAlign: 'center' },
  helpBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#faf8f3', borderWidth: 1, borderColor: '#f0e8cc' },
  helpText: { fontSize: 12, color: GOLD, fontWeight: '700' },

  // Status pill
  statusPillWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf3dc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#f0e8cc', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GOLD },
  statusText: { fontSize: 12, fontWeight: '700', color: GOLD },
  statusEta: { fontSize: 12, color: '#888', fontWeight: '500' },

  // Tabs
  tabRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: GOLD },
  tabText: { fontSize: 13, fontWeight: '600', color: '#aaa' },
  tabTextActive: { color: DARK, fontWeight: '800' },

  // Scroll
  scrollContent: { padding: 16, paddingBottom: 120 },

  // Map
  mapCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  mapTitle: { fontSize: 14, fontWeight: '800', color: DARK, marginBottom: 12 },
  mapBox: { height: 100, backgroundColor: '#f0f7f0', borderRadius: 12, position: 'relative', overflow: 'hidden', justifyContent: 'center' },
  mapRoad: { position: 'absolute', left: 32, right: 32, height: 3, backgroundColor: '#cde8cd', borderRadius: 2, top: '50%' },
  mapPoint: { position: 'absolute', top: '30%', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  mapPointStart: { left: 8 },
  mapPointEnd: { right: 8 },
  riderDot: { position: 'absolute', top: '25%', left: 32 },
  mapFooter: { marginTop: 12, backgroundColor: '#faf8f3', borderRadius: 8, padding: 10 },
  mapEta: { fontSize: 12, color: DARK, fontWeight: '600', textAlign: 'center' },

  // Timeline
  timelineCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  timelineTitle: { fontSize: 15, fontWeight: '800', color: DARK, marginBottom: 20 },

  // Steps
  stepRow: { flexDirection: 'row', marginBottom: 4 },
  stepLeft: { alignItems: 'center', width: 44, position: 'relative' },
  pulseRing: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: GOLD, top: 0, zIndex: 0 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', zIndex: 1, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f5f5f5' },
  stepCircleDone: { backgroundColor: GREEN, borderColor: GREEN },
  stepCircleActive: { backgroundColor: DARK, borderColor: GOLD, borderWidth: 2.5 },
  stepCirclePending: { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0' },
  stepCheckmark: { fontSize: 16, color: '#fff', fontWeight: '800' },
  stepIcon: { fontSize: 18 },
  lineWrapper: { flex: 1, width: 2, backgroundColor: '#f0f0f0', marginTop: 4, marginBottom: 4, borderRadius: 1, overflow: 'hidden', minHeight: 50 },
  line: { width: '100%', height: '100%', transformOrigin: 'top', borderRadius: 1 },
  lineDone: { backgroundColor: GREEN },
  lineActive: { backgroundColor: GOLD },

  // Step content
  stepContent: { flex: 1, paddingLeft: 14, paddingBottom: 24 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepLabel: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 3 },
  stepLabelPending: { color: '#aaa' },
  stepSubLabel: { fontSize: 12, color: '#888', lineHeight: 17 },
  stepTimeBox: { alignItems: 'flex-end' },
  stepTime: { fontSize: 12, fontWeight: '700', color: '#aaa' },
  stepDate: { fontSize: 11, color: '#bbb', marginTop: 2 },
  activeDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#faf3dc', borderRadius: 8, padding: 8, gap: 6 },
  activeDetailDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD },
  activeDetailText: { fontSize: 11, color: GOLD, fontWeight: '600' },

  // Details tab
  detailsSection: {},
  detailCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 2 },
  detailCardTitle: { fontSize: 14, fontWeight: '800', color: DARK, marginBottom: 14 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', gap: 12 },
  orderItemImage: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center' },
  orderItemName: { fontSize: 13, fontWeight: '600', color: DARK, marginBottom: 2 },
  orderItemQty: { fontSize: 11, color: '#888' },
  orderItemPrice: { fontSize: 13, fontWeight: '800', color: GOLD },
  detailText: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 4 },
  detailTextSub: { fontSize: 13, color: '#666', marginBottom: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel: { fontSize: 13, color: '#888' },
  priceValue: { fontSize: 13, fontWeight: '600', color: DARK },
  priceTotalRow: { borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 4, paddingTop: 12 },
  priceTotalLabel: { fontSize: 15, fontWeight: '800', color: DARK },
  priceTotalValue: { fontSize: 15, fontWeight: '800', color: GOLD },

  // Bottom bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12, elevation: 12 },
  contactBtn: { flex: 1, borderWidth: 1.5, borderColor: DARK, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  contactBtnText: { fontSize: 13, fontWeight: '700', color: DARK },
  shopBtn: { flex: 1, backgroundColor: DARK, borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  shopBtnText: { fontSize: 13, fontWeight: '700', color: GOLD },
});

export default OrderTrackingScreen;