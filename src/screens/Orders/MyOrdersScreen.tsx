import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyOrders'>;

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
  id: string;
  orderId: string;
  date: string;
  status: OrderStatus;
  total: string;
  items: { emoji: string; name: string }[];
  itemCount: number;
}

const ORDERS: Order[] = [
  {
    id: '1',
    orderId: 'RF-52847',
    date: 'Jul 10, 2025',
    status: 'Processing',
    total: 'PKR 12,900',
    items: [
      { emoji: '👗', name: 'Zari Embroidered Suit' },
      { emoji: '🧤', name: 'Silk Dupatta' },
    ],
    itemCount: 2,
  },
  {
    id: '2',
    orderId: 'RF-48291',
    date: 'Jun 28, 2025',
    status: 'Delivered',
    total: 'PKR 4,200',
    items: [{ emoji: '🧣', name: 'Floral Printed Kurta' }],
    itemCount: 1,
  },
  {
    id: '3',
    orderId: 'RF-41033',
    date: 'Jun 15, 2025',
    status: 'Shipped',
    total: 'PKR 22,000',
    items: [{ emoji: '👰', name: 'Bridal Chiffon 3-Piece' }],
    itemCount: 1,
  },
  {
    id: '4',
    orderId: 'RF-38820',
    date: 'May 30, 2025',
    status: 'Cancelled',
    total: 'PKR 3,800',
    items: [{ emoji: '🥻', name: 'Cotton Shalwar Kameez' }],
    itemCount: 1,
  },
  {
    id: '5',
    orderId: 'RF-35512',
    date: 'May 12, 2025',
    status: 'Delivered',
    total: 'PKR 8,500',
    items: [{ emoji: '🌸', name: 'Embroidered Lawn 3-Pc' }],
    itemCount: 1,
  },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; icon: string; iconSet: 'ionicon' | 'material' }
> = {
  Processing: { color: GOLD, bg: '#faf3dc', icon: 'timer-sand', iconSet: 'material' },
  Shipped: { color: '#1565c0', bg: '#e3f2fd', icon: 'truck-fast-outline', iconSet: 'material' },
  Delivered: { color: '#2e7d32', bg: '#e8f5e9', icon: 'checkmark-circle', iconSet: 'ionicon' },
  Cancelled: { color: '#c62828', bg: '#ffebee', icon: 'close-circle', iconSet: 'ionicon' },
};

const FILTERS: OrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const PressableScale: React.FC<{
  onPress?: () => void;
  style?: any;
  children: React.ReactNode;
}> = ({ onPress, style, children }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 180 });
      }}
      onPress={onPress}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedTouchable>
  );
};

const StatusIcon = ({
  status,
  size = 13,
}: {
  status: OrderStatus;
  size?: number;
}) => {
  const cfg = STATUS_CONFIG[status];
  if (cfg.iconSet === 'material') {
    return <MaterialCommunityIcons name={cfg.icon} size={size} color={cfg.color} />;
  }
  return <Ionicons name={cfg.icon} size={size} color={cfg.color} />;
};

const OrderCard = ({
  order,
  index,
  onTrack,
  onReorder,
}: {
  order: Order;
  index: number;
  onTrack: () => void;
  onReorder: () => void;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const cfg = STATUS_CONFIG[order.status];

  return (
    <Animated.View style={[styles.orderCard, style]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>#{order.orderId}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <StatusIcon status={order.status} />
          <Text style={[styles.statusText, { color: cfg.color }]}>
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.itemsRow}>
        {order.items.slice(0, 2).map((item, i) => (
          <View key={i} style={styles.itemChip}>
            <View style={styles.itemChipIconWrap}>
              <Ionicons name="shirt-outline" size={14} color={DARK} />
            </View>
            <Text style={styles.itemChipName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        ))}
        {order.itemCount > 2 && (
          <View style={styles.moreChip}>
            <Text style={styles.moreChipText}>+{order.itemCount - 2}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{order.total}</Text>
        </View>

        <View style={styles.cardActions}>
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <PressableScale style={styles.trackBtn} onPress={onTrack}>
              <Feather
                name="map-pin"
                size={13}
                color={GOLD}
                style={styles.btnIcon}
              />
              <Text style={styles.trackBtnText}>Track</Text>
            </PressableScale>
          )}

          {order.status === 'Delivered' && (
            <PressableScale style={styles.reorderBtn} onPress={onReorder}>
              <Feather
                name="repeat"
                size={13}
                color={DARK}
                style={styles.btnIcon}
              />
              <Text style={styles.reorderBtnText}>Reorder</Text>
            </PressableScale>
          )}

          {order.status === 'Cancelled' && (
            <PressableScale style={styles.reorderBtn} onPress={onReorder}>
              <Feather
                name="shopping-bag"
                size={13}
                color={DARK}
                style={styles.btnIcon}
              />
              <Text style={styles.reorderBtnText}>Buy Again</Text>
            </PressableScale>
          )}

          <TouchableOpacity style={styles.detailBtn} activeOpacity={0.6}>
            <Text style={styles.detailBtnText}>Details</Text>
            <Feather name="chevron-right" size={13} color="#aaa" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const MyOrdersScreen = ({ navigation }: Props) => {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');

  const headerOpacity = useSharedValue(0);
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, []);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  const filtered =
    activeFilter === 'All'
      ? ORDERS
      : ORDERS.filter(o => o.status === activeFilter);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.View style={[styles.header, headerStyle]}>
        <PressableScale style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={19} color={DARK} />
        </PressableScale>

        <Text style={styles.headerTitle}>My Orders</Text>

        <View style={styles.orderCountBadge}>
          <Text style={styles.orderCountText}>{ORDERS.length}</Text>
        </View>
      </Animated.View>

      <Animated.View style={headerStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'All' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('All')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'All' && styles.filterTabTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterTab,
                activeFilter === f && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <StatusIcon
                status={f}
                size={12}
              />
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === f && styles.filterTabTextActive,
                  styles.filterTabTextWithIcon,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cube-outline" size={38} color={GOLD} />
            </View>
            <Text style={styles.emptyTitle}>No {activeFilter} orders</Text>
            <Text style={styles.emptySub}>
              Orders in this status will appear here
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <OrderCard
            order={item}
            index={index}
            onTrack={() =>
              navigation.navigate('OrderTracking', { orderId: item.orderId })
            }
            onReorder={() => navigation.navigate('MainTabs')}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 14,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: DARK },

  orderCountBadge: {
    backgroundColor: DARK,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },

  orderCountText: { fontSize: 12, fontWeight: '800', color: GOLD },

  filterRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: BORDER,
  },

  filterTabActive: { backgroundColor: DARK, borderColor: DARK },

  filterTabText: { fontSize: 12, fontWeight: '700', color: GRAY_TEXT },

  filterTabTextWithIcon: { marginLeft: 0 },

  filterTabTextActive: { color: GOLD },

  listContent: { padding: 16, paddingBottom: 40 },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  orderId: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 4 },

  orderDate: { fontSize: 12, color: '#aaa' },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: { fontSize: 11, fontWeight: '700' },

  itemsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },

  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#faf8f3',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0e8cc',
    maxWidth: '70%',
  },

  itemChipIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemChipName: { fontSize: 11, fontWeight: '600', color: DARK, flexShrink: 1 },

  moreChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    justifyContent: 'center',
  },

  moreChipText: { fontSize: 11, fontWeight: '700', color: '#888' },

  divider: { height: 1, backgroundColor: '#f5f5f5', marginBottom: 16 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },

  totalValue: { fontSize: 16, fontWeight: '800', color: GOLD },

  cardActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },

  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },

  trackBtnText: { fontSize: 12, fontWeight: '700', color: GOLD },

  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },

  reorderBtnText: { fontSize: 12, fontWeight: '700', color: DARK },

  btnIcon: { marginRight: 6 },

  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
  },

  detailBtnText: { fontSize: 12, fontWeight: '700', color: '#aaa' },

  emptyBox: { alignItems: 'center', paddingVertical: 70 },

  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 8 },

  emptySub: { fontSize: 13, color: '#aaa', textAlign: 'center' },
});

export default MyOrdersScreen;