import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring,
} from 'react-native-reanimated';

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const MENU_ITEMS = [
  { icon: '📦', label: 'My Orders',       sub: 'Track your orders'        },
  { icon: '📍', label: 'Addresses',        sub: 'Manage delivery addresses' },
  { icon: '💳', label: 'Payment Methods',  sub: 'Cards & wallets'           },
  { icon: '🔔', label: 'Notifications',    sub: 'Alerts & updates'          },
  { icon: '🛡️', label: 'Privacy Policy',   sub: 'Your data & rights'        },
  { icon: '❓', label: 'Help & Support',   sub: 'FAQs & contact us'          },
];

const MenuItem = ({ item, index }: { item: any; index: number }) => {
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
      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <View style={styles.menuIconBox}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Text style={styles.menuSub}>{item.sub}</Text>
        </View>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProfileScreen = () => {
  const avatarScale = useSharedValue(0);
  const infoOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  useEffect(() => {
    avatarScale.value = withDelay(0, withSpring(1, { damping: 12, stiffness: 100 }));
    infoOpacity.value = withDelay(150, withTiming(1, { duration: 500 }));
    statsOpacity.value = withDelay(250, withTiming(1, { duration: 500 }));
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({ transform: [{ scale: avatarScale.value }] }));
  const infoStyle = useAnimatedStyle(() => ({ opacity: infoOpacity.value }));
  const statsStyle = useAnimatedStyle(() => ({ opacity: statsOpacity.value }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Profile Hero */}
        <View style={styles.hero}>
          <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RF</Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✏️</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.profileInfo, infoStyle]}>
            <Text style={styles.profileName}>Raza Ahmed</Text>
            <Text style={styles.profileEmail}>raza.ahmed@example.com</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>✨ Gold Member</Text>
            </View>
          </Animated.View>
        </View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, statsStyle]}>
          {[
            { label: 'Orders',   value: '12' },
            { label: 'Wishlist', value: '4'  },
            { label: 'Reviews',  value: '7'  },
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
            <MenuItem key={item.label} item={item} index={i} />
          ))}
        </View>

        {/* Logout */}
        <Animated.View style={[infoStyle, { paddingHorizontal: 20 }]}>
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85}>
            <Text style={styles.logoutText}>🚪  Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Rangsaz Fashion v1.0.0</Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { alignItems: 'center', paddingTop: 32, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: DARK, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: GOLD },
  avatarText: { fontSize: 28, fontWeight: '800', color: GOLD },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  editBadgeText: { fontSize: 12 },
  profileInfo: { alignItems: 'center' },
  profileName: { fontSize: 20, fontWeight: '800', color: DARK, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#888', marginBottom: 10 },
  memberBadge: { backgroundColor: '#faf3dc', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: GOLD },
  memberText: { fontSize: 12, color: GOLD, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, marginVertical: 20, backgroundColor: '#faf8f3', borderRadius: 16, borderWidth: 1, borderColor: '#f0e8cc', overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: '#f0e8cc' },
  statValue: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#888', fontWeight: '500' },
  menuSection: { paddingHorizontal: 20, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuIcon: { fontSize: 18 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: DARK, marginBottom: 2 },
  menuSub: { fontSize: 11, color: '#aaa' },
  menuArrow: { fontSize: 22, color: '#ccc', fontWeight: '300' },
  logoutBtn: { borderWidth: 1.5, borderColor: '#f0f0f0', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#d32f2f' },
  version: { textAlign: 'center', fontSize: 11, color: '#ccc' },
});

export default ProfileScreen;