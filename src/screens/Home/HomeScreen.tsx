import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Dimensions, FlatList, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const BANNERS = [
  { id: '1', label: 'New Arrivals', subtitle: 'Spring Collection 2025', bg: '#1a1a1a' },
  { id: '2', label: 'Exclusive Sale', subtitle: 'Up to 40% Off', bg: '#2a1f0a' },
  { id: '3', label: 'Limited Edition', subtitle: 'Festive Wear', bg: '#0a1a0d' },
];

const CATEGORIES = [
  { id: '1', name: 'Lawn',    icon: '🌸' },
  { id: '2', name: 'Formal',  icon: '✨' },
  { id: '3', name: 'Bridal',  icon: '👰' },
  { id: '4', name: 'Casual',  icon: '🧵' },
  { id: '5', name: 'Sale',    icon: '🏷️' },
];

const PRODUCTS = [
  { id: '1', name: 'Zari Embroidered Suit',   price: 'PKR 8,500',  badge: 'NEW'  },
  { id: '2', name: 'Floral Printed Kurta',    price: 'PKR 4,200',  badge: 'SALE' },
  { id: '3', name: 'Bridal Chiffon 3-Piece',  price: 'PKR 22,000', badge: 'HOT'  },
  { id: '4', name: 'Cotton Shalwar Kameez',   price: 'PKR 3,800',  badge: null   },
];

const FadeSlide = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

const PulseDot = () => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.4, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1, false,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[styles.pulseDot, style]} />;
};

const HomeScreen = ({ navigation }: Props) => {
  const scrollX = useRef(0);
  const bannerRef = useRef<FlatList>(null);
  const currentBanner = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentBanner.value + 1) % BANNERS.length;
      currentBanner.value = next;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Header */}
        <FadeSlide delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome Back 👋</Text>
              <Text style={styles.brandName}>Rangsaz Fashion</Text>
            </View>
            <View style={styles.headerRight}>
              <PulseDot />
              <TouchableOpacity style={styles.notifBtn}>
                <Text style={styles.notifIcon}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </FadeSlide>

        {/* Banner Carousel */}
        <FadeSlide delay={100}>
          <FlatList
            ref={bannerRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            style={styles.bannerList}
            renderItem={({ item }) => (
              <View style={[styles.banner, { backgroundColor: item.bg }]}>
                <View style={styles.bannerContent}>
                  <View style={styles.bannerBadge}>
                    <Text style={styles.bannerBadgeText}>EXCLUSIVE</Text>
                  </View>
                  <Text style={styles.bannerLabel}>{item.label}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                  <TouchableOpacity style={styles.shopNowBtn}>
                    <Text style={styles.shopNowText}>SHOP NOW →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </FadeSlide>

        {/* Categories */}
        <FadeSlide delay={200}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.8}>
                <View style={styles.categoryCircle}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeSlide>

        {/* Featured Products */}
        <FadeSlide delay={300}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {PRODUCTS.map((product, i) => (
              <FadeSlide key={product.id} delay={300 + i * 80}>
                <TouchableOpacity
  style={styles.productCard}
  activeOpacity={0.85}
  onPress={() => navigation.navigate('ProductDetail', {
    id: product.id,
    name: product.name,
    price: product.price,
    emoji: '👗',
    badge: product.badge,
  })}
>
                  <View style={styles.productImageBox}>
                    {product.badge && (
                      <View style={[styles.productBadge,
                        { backgroundColor: product.badge === 'SALE' ? '#d32f2f' : DARK }]}>
                        <Text style={styles.productBadgeText}>{product.badge}</Text>
                      </View>
                    )}
                    <Text style={styles.productEmoji}>👗</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>{product.price}</Text>
                      <TouchableOpacity style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </FadeSlide>
            ))}
          </View>
        </FadeSlide>

        {/* Promo Banner */}
        <FadeSlide delay={500}>
          <View style={styles.promoBanner}>
            <Text style={styles.promoText}>🏷️  Free shipping on orders above PKR 5,000</Text>
          </View>
        </FadeSlide>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  greeting: { fontSize: 13, color: '#888' },
  brandName: { fontSize: 20, fontWeight: '800', color: DARK, letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GOLD },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  notifIcon: { fontSize: 16 },
  bannerList: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  banner: { width: width - 40, borderRadius: 16, padding: 24, height: 180, justifyContent: 'center' },
  bannerContent: {},
  bannerBadge: { backgroundColor: GOLD, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, marginBottom: 10 },
  bannerBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  bannerLabel: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bannerSubtitle: { fontSize: 13, color: '#ccc', marginBottom: 16 },
  shopNowBtn: { backgroundColor: GOLD, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  shopNowText: { color: DARK, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: DARK },
  seeAll: { fontSize: 12, color: GOLD, fontWeight: '600' },
  categoriesRow: { paddingHorizontal: 16, gap: 8 },
  categoryItem: { alignItems: 'center', marginHorizontal: 6 },
  categoryCircle: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#faf8f3', borderWidth: 1.5, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryIcon: { fontSize: 22 },
  categoryName: { fontSize: 11, fontWeight: '600', color: DARK },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  productCard: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
  productImageBox: { height: 140, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productEmoji: { fontSize: 52 },
  productBadge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  productBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, fontWeight: '600', color: DARK, marginBottom: 8, lineHeight: 17 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 12, fontWeight: '800', color: GOLD },
  addBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: DARK, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', lineHeight: 20 },
  promoBanner: { marginHorizontal: 20, marginTop: 20, backgroundColor: '#faf8f3', borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: GOLD },
  promoText: { fontSize: 13, color: DARK, fontWeight: '500' },
});

export default HomeScreen;