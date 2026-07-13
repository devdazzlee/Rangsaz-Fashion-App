import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
// In ProfileScreen.tsx, add navigation prop first:
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

type MenuItemProps = {
  item: any;
  index: number;
  navigation: Props['navigation'];
};

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

const MENU_ITEMS = [
  {
    icon: 'cube-outline',
    label: 'My Orders',
    sub: 'Track your orders',
    screen: 'MyOrders',
  },
  {
    icon: 'location-outline',
    label: 'Addresses',
    sub: 'Manage delivery addresses',
    screen: 'Addresses',
  },
  {
    icon: 'card-outline',
    label: 'Payment Methods',
    sub: 'Cards & wallets',
    screen: 'PaymentMethods',
  },
  {
    icon: 'notifications-outline',
    label: 'Notifications',
    sub: 'Alerts & updates',
    screen: 'Notifications',
  },
  {
    icon: 'shield-checkmark-outline',
    label: 'Privacy Policy',
    sub: 'Your data & rights',
    screen: 'PrivacyPolicy',
  },
  {
    icon: 'help-circle-outline',
    label: 'Help & Support',
    sub: 'FAQs & contact us',
    screen: 'HelpSupport',
  },
];

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

const MenuItem = ({ item, index, navigation }: MenuItemProps) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(300 + index * 70, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(300 + index * 70, withTiming(0, { duration: 400 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.7}
        onPress={() => item.screen && navigation.navigate(item.screen as any)}
      >
        <View style={styles.menuIconBox}>
          <Ionicons name={item.icon} size={19} color={DARK} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Text style={styles.menuSub}>{item.sub}</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#ccc" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProfileScreen = ({ navigation }: Props) => {
  const avatarScale = useSharedValue(0);
  const infoOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  useEffect(() => {
    avatarScale.value = withDelay(0, withSpring(1, { damping: 12, stiffness: 100 }));
    infoOpacity.value = withDelay(150, withTiming(1, { duration: 500 }));
    statsOpacity.value = withDelay(250, withTiming(1, { duration: 500 }));
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));
  const infoStyle = useAnimatedStyle(() => ({ opacity: infoOpacity.value }));
  const statsStyle = useAnimatedStyle(() => ({ opacity: statsOpacity.value }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Profile Hero */}
        <View style={styles.hero}>
          <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RF</Text>
            </View>
            <PressableScale
              style={styles.editBadge}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Feather name="edit-2" size={12} color={DARK} />
            </PressableScale>
          </Animated.View>

          <Animated.View style={[styles.profileInfo, infoStyle]}>
            <Text style={styles.profileName}>Raza Ahmed</Text>
            <Text style={styles.profileEmail}>raza.ahmed@example.com</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="sparkles" size={12} color={GOLD} style={styles.memberBadgeIcon} />
              <Text style={styles.memberText}>Gold Member</Text>
            </View>
          </Animated.View>
        </View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, statsStyle]}>
          {[
            { label: 'Orders', value: '12' },
            { label: 'Wishlist', value: '4' },
            { label: 'Reviews', value: '7' },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, i) => (
            <MenuItem key={item.label} item={item} index={i} navigation={navigation} />
          ))}
        </View>

        {/* Logout */}
        <Animated.View style={[infoStyle, { paddingHorizontal: 20 }]}>
          <PressableScale style={styles.logoutBtn}>
            <Feather name="log-out" size={16} color="#d32f2f" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Log Out</Text>
          </PressableScale>
          <Text style={styles.version}>Rangsaz Fashion v1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  hero: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  avatarWrapper: { position: 'relative', marginBottom: 16 },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: GOLD,
  },

  avatarText: { fontSize: 28, fontWeight: '800', color: GOLD },

  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  profileInfo: { alignItems: 'center' },

  profileName: { fontSize: 20, fontWeight: '800', color: DARK, marginBottom: 4 },

  profileEmail: { fontSize: 13, color: GRAY_TEXT, marginBottom: 12 },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf3dc',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GOLD,
  },

  memberBadgeIcon: { marginRight: 6 },

  memberText: { fontSize: 12, color: GOLD, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 22,
    backgroundColor: '#faf8f3',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0e8cc',
    overflow: 'hidden',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: '#f0e8cc',
  },

  statValue: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 2 },

  statLabel: { fontSize: 11, color: GRAY_TEXT, fontWeight: '500' },

  menuSection: { paddingHorizontal: 20, marginBottom: 22 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },

  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#faf8f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  menuText: { flex: 1 },

  menuLabel: { fontSize: 14, fontWeight: '600', color: DARK, marginBottom: 2 },

  menuSub: { fontSize: 11, color: '#aaa' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffe0e0',
    borderRadius: 16,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: '#fffafa',
  },

  logoutIcon: { marginRight: 8 },

  logoutText: { fontSize: 14, fontWeight: '700', color: '#d32f2f' },

  version: { textAlign: 'center', fontSize: 11, color: '#ccc' },
});

export default ProfileScreen;