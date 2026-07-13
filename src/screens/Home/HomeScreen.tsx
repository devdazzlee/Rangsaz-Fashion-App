import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
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
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

const BANNERS = [
  {
    id: '1',
    label: 'New Arrivals',
    subtitle: 'Spring Collection 2025',
    bg: '#1a1a1a',
  },
  {
    id: '2',
    label: 'Exclusive Sale',
    subtitle: 'Up to 40% Off',
    bg: '#2a1f0a',
  },
  {
    id: '3',
    label: 'Limited Edition',
    subtitle: 'Festive Wear',
    bg: '#0a1a0d',
  },
];

const CATEGORIES: { id: string; name: string; iconSet: 'material' | 'ionicon'; icon: string }[] = [
  { id: '1', name: 'Lawn', iconSet: 'material', icon: 'flower-outline' },
  { id: '2', name: 'Formal', iconSet: 'ionicon', icon: 'sparkles-outline' },
  { id: '3', name: 'Bridal', iconSet: 'ionicon', icon: 'heart-outline' },
  { id: '4', name: 'Casual', iconSet: 'material', icon: 'tshirt-crew-outline' },
  { id: '5', name: 'Sale', iconSet: 'ionicon', icon: 'pricetag-outline' },
];

const PRODUCTS = [
  { id: '1', name: 'Zari Embroidered Suit', price: 'PKR 8,500', badge: 'NEW' },
  { id: '2', name: 'Floral Printed Kurta', price: 'PKR 4,200', badge: 'SALE' },
  {
    id: '3',
    name: 'Bridal Chiffon 3-Piece',
    price: 'PKR 22,000',
    badge: 'HOT',
  },
  { id: '4', name: 'Cotton Shalwar Kameez', price: 'PKR 3,800', badge: null },
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
        scale.value = withTiming(0.94, { duration: 100 });
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

const FadeSlide = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
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
      withSequence(
        withTiming(1.4, { duration: 600 }),
        withTiming(1, { duration: 600 }),
      ),
      -1,
      false,
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return <Animated.View style={[styles.pulseDot, style]} />;
};

const CategoryIcon = ({
  iconSet,
  icon,
  size = 22,
  color = DARK,
}: {
  iconSet: 'material' | 'ionicon';
  icon: string;
  size?: number;
  color?: string;
}) => {
  if (iconSet === 'material') {
    return <MaterialCommunityIcons name={icon} size={size} color={color} />;
  }
  return <Ionicons name={icon} size={size} color={color} />;
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Header */}
        <FadeSlide delay={0}>
          <View style={styles.header}>
            <View>
              <View style={styles.greetingRow}>
                <Text style={styles.greeting}>Welcome Back</Text>
                <Ionicons name="hand-right-outline" size={14} color={GOLD} />
              </View>
              <Text style={styles.brandName}>Rangsaz Fashion</Text>
            </View>

            <View style={styles.headerRight}>
              <PulseDot />

              <PressableScale
                style={styles.notifBtn}
                onPress={() => navigation.navigate('Search')}
              >
                <Feather name="search" size={17} color={DARK} />
              </PressableScale>

              <PressableScale
                style={styles.notifBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={DARK}
                />
              </PressableScale>
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
                    <Ionicons
                      name="diamond-outline"
                      size={10}
                      color="#fff"
                      style={styles.bannerBadgeIcon}
                    />
                    <Text style={styles.bannerBadgeText}>EXCLUSIVE</Text>
                  </View>

                  <Text style={styles.bannerLabel}>{item.label}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>

                  <PressableScale style={styles.shopNowBtn}>
                    <Text style={styles.shopNowText}>SHOP NOW</Text>
                    <Feather
                      name="arrow-right"
                      size={13}
                      color={DARK}
                      style={styles.shopNowIcon}
                    />
                  </PressableScale>
                </View>
              </View>
            )}
          />
        </FadeSlide>

        {/* Categories */}
        <FadeSlide delay={200}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                activeOpacity={0.8}
              >
                <View style={styles.categoryCircle}>
                  <CategoryIcon iconSet={cat.iconSet} icon={cat.icon} />
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
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {PRODUCTS.map((product, i) => (
              <FadeSlide key={product.id} delay={300 + i * 80}>
                <TouchableOpacity
                  style={styles.productCard}
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      emoji: '👗',
                      badge: product.badge,
                    })
                  }
                >
                  <View style={styles.productImageBox}>
                    {product.badge && (
                      <View
                        style={[
                          styles.productBadge,
                          {
                            backgroundColor:
                              product.badge === 'SALE' ? '#d32f2f' : DARK,
                          },
                        ]}
                      >
                        <Text style={styles.productBadgeText}>
                          {product.badge}
                        </Text>
                      </View>
                    )}

                    <View style={styles.productImagePlaceholder}>
                      <Ionicons
                        name="shirt-outline"
                        size={44}
                        color="#D8CBA0"
                      />
                    </View>
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>

                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>{product.price}</Text>

                      <TouchableOpacity
                        style={styles.addBtn}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
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
            <View style={styles.promoIconWrap}>
              <Ionicons name="pricetag-outline" size={16} color={GOLD} />
            </View>
            <Text style={styles.promoText}>
              Free shipping on orders above PKR 5,000
            </Text>
          </View>
        </FadeSlide>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },

  greeting: { fontSize: 13, color: GRAY_TEXT },

  brandName: {
    fontSize: 21,
    fontWeight: '800',
    color: DARK,
    letterSpacing: 0.3,
  },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GOLD },

  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bannerList: { marginHorizontal: 20, borderRadius: 22, overflow: 'hidden' },

  banner: {
    width: width - 40,
    borderRadius: 22,
    padding: 26,
    height: 190,
    justifyContent: 'center',
  },

  bannerContent: {},

  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOLD,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },

  bannerBadgeIcon: { marginRight: 5 },

  bannerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  bannerLabel: {
    fontSize: 25,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },

  bannerSubtitle: { fontSize: 13, color: '#ccc', marginBottom: 18 },

  shopNowBtn: {
    backgroundColor: GOLD,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  shopNowIcon: { marginLeft: 8 },

  shopNowText: {
    color: DARK,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: DARK },

  seeAll: { fontSize: 12, color: GOLD, fontWeight: '700' },

  categoriesRow: { paddingHorizontal: 16, gap: 6 },

  categoryItem: { alignItems: 'center', marginHorizontal: 8 },

  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: GOLD_SOFT,
    borderWidth: 1,
    borderColor: '#EFE1A9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  categoryName: { fontSize: 12, fontWeight: '600', color: DARK },

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 14,
  },

  productCard: {
    width: (width - 46) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },

  productImageBox: {
    height: 145,
    backgroundColor: '#faf8f3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  productImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },

  productBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  productInfo: { padding: 14 },

  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: DARK,
    marginBottom: 10,
    lineHeight: 18,
  },

  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productPrice: { fontSize: 14, fontWeight: '800', color: GOLD },

  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  promoBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#faf8f3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0e2aa',
  },

  promoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  promoText: { flex: 1, fontSize: 13, color: DARK, fontWeight: '500' },
});

export default HomeScreen;