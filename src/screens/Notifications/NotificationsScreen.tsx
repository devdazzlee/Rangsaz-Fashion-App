import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

type NotifType = 'order' | 'offer' | 'delivery' | 'system';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  { id: '1', type: 'delivery', title: 'Order Shipped!', body: 'Your order #RF-52847 is on its way. Expected delivery tomorrow.', time: '2 min ago', read: false },
  { id: '2', type: 'offer', title: 'Exclusive Deal', body: 'Get 25% off on all Bridal wear this weekend only. Use code: BRIDE25', time: '1 hr ago', read: false },
  { id: '3', type: 'order', title: 'Order Confirmed', body: 'Your order #RF-52847 has been confirmed. We are preparing your package.', time: '3 hrs ago', read: false },
  { id: '4', type: 'offer', title: 'New Arrivals', body: 'Summer lawn collection just dropped! Shop the latest prints before they sell out.', time: 'Yesterday', read: true },
  { id: '5', type: 'delivery', title: 'Out for Delivery', body: 'Your order #RF-48291 will be delivered today between 2 PM – 6 PM.', time: 'Yesterday', read: true },
  { id: '6', type: 'order', title: 'Order Delivered', body: 'Your order #RF-41033 has been delivered. We hope you love it!', time: '2 days ago', read: true },
  { id: '7', type: 'system', title: 'Profile Updated', body: 'Your profile information has been updated successfully.', time: '3 days ago', read: true },
  { id: '8', type: 'offer', title: 'Eid Collection is Live!', body: 'Shop exclusive Eid outfits with free shipping on all orders above PKR 5,000.', time: '5 days ago', read: true },
  { id: '9', type: 'order', title: 'Order Cancelled', body: 'Your order #RF-38820 was cancelled. Refund will be processed in 3-5 days.', time: '1 week ago', read: true },
];

const TYPE_CONFIG: Record<
  NotifType,
  { icon: string; iconSet: 'ionicon' | 'material'; color: string; bg: string }
> = {
  order: { icon: 'cube-outline', iconSet: 'ionicon', color: DARK, bg: '#f5f5f5' },
  offer: { icon: 'pricetag-outline', iconSet: 'ionicon', color: '#7b1fa2', bg: '#f3e5f5' },
  delivery: { icon: 'truck-fast-outline', iconSet: 'material', color: '#1565c0', bg: '#e3f2fd' },
  system: { icon: 'cog-outline', iconSet: 'material', color: '#37474f', bg: '#eceff1' },
};

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

const TypeIcon = ({
  type,
  size = 20,
  color,
}: {
  type: NotifType;
  size?: number;
  color: string;
}) => {
  const cfg = TYPE_CONFIG[type];
  if (cfg.iconSet === 'material') {
    return <MaterialCommunityIcons name={cfg.icon} size={size} color={color} />;
  }
  return <Ionicons name={cfg.icon} size={size} color={color} />;
};

const NotifCard = ({
  item,
  index,
  onRead,
}: {
  item: Notif;
  index: number;
  onRead: (id: string) => void;
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-24);
  const unreadScale = useSharedValue(item.read ? 0 : 1);

  useEffect(() => {
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(
      index * 60,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: unreadScale.value }],
    opacity: unreadScale.value,
  }));

  const handlePress = () => {
    if (!item.read) {
      unreadScale.value = withSpring(0, { damping: 12 });
      onRead(item.id);
    }
  };

  const cfg = TYPE_CONFIG[item.type];

  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity
        style={[styles.notifCard, !item.read && styles.notifCardUnread]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        {/* Icon */}
        <View style={[styles.notifIconBox, { backgroundColor: cfg.bg }]}>
          <TypeIcon type={item.type} color={cfg.color} />
        </View>

        {/* Content */}
        <View style={styles.notifContent}>
          <View style={styles.notifTitleRow}>
            <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
              {item.title}
            </Text>
            <Animated.View style={[styles.unreadDot, dotStyle]} />
          </View>
          <Text style={styles.notifBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = ({ navigation }: Props) => {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const unreadCount = notifs.filter(n => !n.read).length;

  const headerOpacity = useSharedValue(0);
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, []);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Group by today/yesterday/older
  const todayItems = notifs.filter(n => n.time.includes('min') || n.time.includes('hr'));
  const yesterdayItems = notifs.filter(n => n.time === 'Yesterday');
  const olderItems = notifs.filter(n => n.time.includes('days') || n.time.includes('week'));

  const sections = [
    { title: 'Today', data: todayItems },
    { title: 'Yesterday', data: yesterdayItems },
    { title: 'Earlier', data: olderItems },
  ].filter(s => s.data.length > 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <PressableScale style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={19} color={DARK} />
        </PressableScale>

        <Text style={styles.headerTitle}>Notifications</Text>

        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </Animated.View>

      {/* Unread count pill */}
      {unreadCount > 0 && (
        <Animated.View style={[styles.unreadBanner, headerStyle]}>
          <Ionicons
            name="notifications"
            size={15}
            color={GOLD}
            style={styles.unreadBannerIcon}
          />
          <Text style={styles.unreadBannerText}>
            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </Animated.View>
      )}

      <FlatList
        data={sections}
        keyExtractor={(item, i) => `section-${i}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-outline" size={38} color={GOLD} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySub}>
              We'll notify you about orders and offers
            </Text>
          </View>
        }
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.map((notif, i) => (
              <NotifCard key={notif.id} item={notif} index={i} onRead={markRead} />
            ))}
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK },

  markAllText: { fontSize: 12, fontWeight: '700', color: GOLD },

  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf3dc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e8cc',
  },

  unreadBannerIcon: { marginRight: 8 },

  unreadBannerText: { fontSize: 13, fontWeight: '600', color: '#8A7A3F' },

  listContent: { padding: 16, paddingBottom: 40 },

  section: { marginBottom: 22 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#aaa',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    gap: 14,

    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },

  notifCardUnread: { borderLeftWidth: 3, borderLeftColor: GOLD },

  notifIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notifContent: { flex: 1 },

  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  notifTitle: { fontSize: 14, fontWeight: '600', color: DARK, flex: 1 },

  notifTitleUnread: { fontWeight: '800' },

  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GOLD, marginLeft: 8 },

  notifBody: { fontSize: 12, color: GRAY_TEXT, lineHeight: 18, marginBottom: 6 },

  notifTime: { fontSize: 11, color: '#bbb', fontWeight: '500' },

  emptyBox: { alignItems: 'center', paddingVertical: 90 },

  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 8 },

  emptySub: { fontSize: 13, color: '#aaa', textAlign: 'center' },
});

export default NotificationsScreen;