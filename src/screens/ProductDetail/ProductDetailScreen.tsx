import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = ['#C9A227', '#1a1a1a', '#8B4513', '#2E4057', '#6B3FA0'];

const REVIEWS = [
  {
    id: '1',
    name: 'Ayesha Khan',
    rating: 5,
    comment: 'Absolutely stunning dress! The fabric quality is exceptional and the embroidery is breathtaking.',
    date: '2 days ago',
    initials: 'AK',
  },
  {
    id: '2',
    name: 'Sana Malik',
    rating: 4,
    comment: 'Beautiful design and great stitching. Delivery was fast. Will definitely order again!',
    date: '1 week ago',
    initials: 'SM',
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    rating: 5,
    comment: 'Perfect for Eid! Got so many compliments. The color is exactly as shown in the picture.',
    date: '2 weeks ago',
    initials: 'FZ',
  },
];

const SIMILAR = [
  { id: 's1', emoji: '🥻', name: 'Silk Anarkali',       price: 'PKR 12,000' },
  { id: 's2', emoji: '👘', name: 'Chiffon Dupatta Set', price: 'PKR 7,500'  },
  { id: 's3', emoji: '🌸', name: 'Lawn Printed 3-Pc',   price: 'PKR 5,200'  },
];

const Stars = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Text key={i} style={{ fontSize: 12, color: i <= rating ? GOLD : '#ddd' }}>★</Text>
    ))}
  </View>
);

const ReviewCard = ({ review, index }: { review: any; index: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return (
    <Animated.View style={[styles.reviewCard, style]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{review.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewName}>{review.name}</Text>
          <View style={styles.reviewMeta}>
            <Stars rating={review.rating} />
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </Animated.View>
  );
};

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const { name, price, emoji, badge } = route.params;

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Animations
  const imageScale = useSharedValue(0.9);
  const imageOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(30);
  const cartBtnScale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const badgeScale = useSharedValue(0);

  useEffect(() => {
    imageScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    imageOpacity.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    contentY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const cartBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartBtnScale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  const handleAddToCart = () => {
    cartBtnScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 150 }),
    );
    badgeScale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1),
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 8 }),
      withSpring(1),
    );
    setWishlisted(!wishlisted);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={styles.shareIcon}>⤴</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Product Image */}
        <Animated.View style={[styles.imageSection, imageStyle]}>
          <View style={styles.imageBox}>
            {badge && (
              <View style={[styles.imageBadge,
                { backgroundColor: badge === 'SALE' ? '#d32f2f' : DARK }]}>
                <Text style={styles.imageBadgeText}>{badge}</Text>
              </View>
            )}
            <Text style={styles.productEmoji}>{emoji}</Text>
          </View>

          {/* Thumbnail row */}
          <View style={styles.thumbnailRow}>
            {['👗', '🧵', '✨'].map((e, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.thumbnail, i === 0 && styles.thumbnailActive]}
              >
                <Text style={{ fontSize: 20 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Product Info */}
        <Animated.View style={[styles.infoSection, contentStyle]}>

          {/* Name & Wishlist */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{name}</Text>
              <View style={styles.ratingRow}>
                <Stars rating={4} />
                <Text style={styles.ratingCount}>(128 reviews)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleWishlist} style={styles.wishlistBtn}>
              <Animated.Text style={[styles.wishlistIcon, heartStyle]}>
                {wishlisted ? '❤️' : '🤍'}
              </Animated.Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{price}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>15% OFF</Text>
            </View>
            <Text style={styles.originalPrice}>PKR 10,000</Text>
          </View>

          {/* Color Selector */}
          <Text style={styles.sectionLabel}>Select Color</Text>
          <View style={styles.colorsRow}>
            {COLORS.map((color, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === i && styles.colorCircleActive,
                ]}
                onPress={() => setSelectedColor(i)}
              />
            ))}
          </View>

          {/* Size Selector */}
          <View style={styles.sizeLabelRow}>
            <Text style={styles.sectionLabel}>Select Size</Text>
            <TouchableOpacity>
              <Text style={styles.sizeGuide}>Size Guide →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sizesRow}>
            {SIZES.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <View style={styles.qtyRow}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            A masterpiece of craftsmanship, this exquisite dress features intricate hand-embroidered
            detailing on premium quality fabric. Perfect for formal occasions, weddings, and festive
            celebrations. The rich texture and elegant silhouette make it a timeless addition to your
            wardrobe.
          </Text>

          {/* Features */}
          <View style={styles.featuresRow}>
            {[
              { icon: '🧵', label: 'Premium Fabric'   },
              { icon: '✂️', label: 'Custom Stitching'  },
              { icon: '🚚', label: 'Free Delivery'     },
              { icon: '↩️', label: 'Easy Returns'      },
            ].map(f => (
              <View key={f.label} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionLabel}>Customer Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Summary */}
          <View style={styles.ratingSummary}>
            <View style={styles.ratingBig}>
              <Text style={styles.ratingNumber}>4.7</Text>
              <Stars rating={5} />
              <Text style={styles.ratingTotal}>128 reviews</Text>
            </View>
            <View style={styles.ratingBars}>
              {[
                { stars: 5, pct: 72 },
                { stars: 4, pct: 18 },
                { stars: 3, pct: 6  },
                { stars: 2, pct: 3  },
                { stars: 1, pct: 1  },
              ].map(r => (
                <View key={r.stars} style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>{r.stars}★</Text>
                  <View style={styles.ratingBarBg}>
                    <View style={[styles.ratingBarFill, { width: `${r.pct}%` }]} />
                  </View>
                  <Text style={styles.ratingBarPct}>{r.pct}%</Text>
                </View>
              ))}
            </View>
          </View>

          {REVIEWS.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}

          {/* Similar Products */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>You May Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarRow}>
            {SIMILAR.map(item => (
              <TouchableOpacity key={item.id} style={styles.similarCard} activeOpacity={0.85}>
                <View style={styles.similarImage}>
                  <Text style={styles.similarEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.similarName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.similarPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyNowBtn}>
          <Text style={styles.buyNowText}>BUY NOW</Text>
        </TouchableOpacity>
        <Animated.View style={[{ flex: 1 }, cartBtnStyle]}>
          <TouchableOpacity
            style={[styles.addCartBtn, addedToCart && styles.addCartBtnSuccess]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            {addedToCart
              ? <Text style={styles.addCartText}>✓ ADDED!</Text>
              : <Text style={styles.addCartText}>ADD TO CART</Text>
            }
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Added to Cart toast badge */}
      {addedToCart && (
        <Animated.View style={[styles.toast, badgeStyle]}>
          <Text style={styles.toastText}>🛍️  Added to cart successfully!</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, color: DARK, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: DARK },
  shareBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  shareIcon: { fontSize: 16, color: DARK },

  // Image
  imageSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  imageBox: { height: 280, backgroundColor: '#faf8f3', borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: '#f0e8cc' },
  imageBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  imageBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  productEmoji: { fontSize: 100 },
  thumbnailRow: { flexDirection: 'row', gap: 10, marginTop: 14, justifyContent: 'center' },
  thumbnail: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#eee' },
  thumbnailActive: { borderColor: GOLD, backgroundColor: '#faf3dc' },

  // Info
  infoSection: { paddingHorizontal: 20, paddingTop: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  productName: { fontSize: 20, fontWeight: '800', color: DARK, lineHeight: 26, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingCount: { fontSize: 12, color: '#888' },
  wishlistBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fdf6f0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f0e8cc', marginLeft: 8 },
  wishlistIcon: { fontSize: 20 },

  // Price
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  price: { fontSize: 22, fontWeight: '800', color: GOLD },
  discountBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { fontSize: 11, fontWeight: '700', color: '#2e7d32' },
  originalPrice: { fontSize: 13, color: '#bbb', textDecorationLine: 'line-through' },

  // Colors
  sectionLabel: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 12 },
  colorsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  colorCircle: { width: 30, height: 30, borderRadius: 15 },
  colorCircleActive: { borderWidth: 3, borderColor: DARK, transform: [{ scale: 1.15 }] },

  // Sizes
  sizeLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sizeGuide: { fontSize: 12, color: GOLD, fontWeight: '600' },
  sizesRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  sizeBtn: { width: 48, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: '#eee', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' },
  sizeBtnActive: { borderColor: DARK, backgroundColor: DARK },
  sizeBtnText: { fontSize: 13, fontWeight: '600', color: '#666' },
  sizeBtnTextActive: { color: GOLD },

  // Quantity
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 4 },
  qtyBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  qtyBtnText: { fontSize: 18, color: DARK, fontWeight: '700', lineHeight: 22 },
  qtyValue: { fontSize: 16, fontWeight: '800', color: DARK, minWidth: 24, textAlign: 'center' },

  // Description
  description: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 },

  // Features
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#faf8f3', borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#f0e8cc' },
  featureItem: { alignItems: 'center', gap: 6 },
  featureIcon: { fontSize: 20 },
  featureLabel: { fontSize: 10, color: '#666', fontWeight: '600', textAlign: 'center' },

  // Reviews
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAll: { fontSize: 12, color: GOLD, fontWeight: '600' },
  ratingSummary: { flexDirection: 'row', backgroundColor: '#faf8f3', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f0e8cc', gap: 16 },
  ratingBig: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  ratingNumber: { fontSize: 36, fontWeight: '800', color: DARK },
  ratingTotal: { fontSize: 11, color: '#888', marginTop: 2 },
  ratingBars: { flex: 1, gap: 5 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingBarLabel: { fontSize: 11, color: '#888', width: 22 },
  ratingBarBg: { flex: 1, height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: '100%', backgroundColor: GOLD, borderRadius: 3 },
  ratingBarPct: { fontSize: 10, color: '#aaa', width: 28, textAlign: 'right' },
  reviewCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 2 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: DARK, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontSize: 12, fontWeight: '700', color: GOLD },
  reviewName: { fontSize: 13, fontWeight: '700', color: DARK, marginBottom: 3 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewDate: { fontSize: 11, color: '#aaa' },
  reviewComment: { fontSize: 13, color: '#555', lineHeight: 20 },

  // Similar
  similarRow: { marginBottom: 8 },
  similarCard: { width: 130, marginRight: 12, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 2 },
  similarImage: { height: 100, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center' },
  similarEmoji: { fontSize: 40 },
  similarName: { fontSize: 11, fontWeight: '600', color: DARK, padding: 8, paddingBottom: 2, lineHeight: 15 },
  similarPrice: { fontSize: 11, fontWeight: '800', color: GOLD, paddingHorizontal: 8, paddingBottom: 8 },

  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12, elevation: 12 },
  buyNowBtn: { flex: 1, borderWidth: 2, borderColor: DARK, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buyNowText: { fontSize: 13, fontWeight: '800', color: DARK, letterSpacing: 1 },
  addCartBtn: { flex: 1, backgroundColor: DARK, borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  addCartBtnSuccess: { backgroundColor: '#2e7d32' },
  addCartText: { fontSize: 13, fontWeight: '800', color: GOLD, letterSpacing: 1 },

  // Toast
  toast: { position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: DARK, borderRadius: 12, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 8 },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});

export default ProductDetailScreen;