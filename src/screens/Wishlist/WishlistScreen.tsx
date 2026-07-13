import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

const WISHLIST = [
  { id: '1', name: 'Bridal Chiffon 3-Piece', price: 'PKR 22,000', emoji: '👰', tag: 'HOT' },
  { id: '2', name: 'Zari Embroidered Suit', price: 'PKR 8,500', emoji: '👗', tag: 'NEW' },
  { id: '3', name: 'Embroidered Lawn 3-Pc', price: 'PKR 6,500', emoji: '🌸', tag: null },
  { id: '4', name: 'Silk Dupatta', price: 'PKR 2,200', emoji: '🧤', tag: 'SALE' },
];

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicons);
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

const WishlistCard = ({ item, index, onRemove }: any) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    scale.value = withDelay(index * 100, withSpring(1, { damping: 15 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleRemove = () => {
    heartScale.value = withSpring(1.4, {}, () => {
      heartScale.value = withSpring(1);
    });
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <Animated.View style={[{ width: (width - 44) / 2 }, style]}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.imageBox}>
          {item.tag && (
            <View
              style={[
                styles.tag,
                { backgroundColor: item.tag === 'SALE' ? '#d32f2f' : DARK },
              ]}
            >
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.heartBtn}
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AnimatedIonicon
              name="heart"
              size={17}
              color={GOLD}
              style={heartStyle}
            />
          </TouchableOpacity>

          <View style={styles.imagePlaceholder}>
            <Ionicons name="shirt-outline" size={44} color="#D8CBA0" />
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.cardPrice}>{item.price}</Text>

          <PressableScale style={styles.addCartBtn}>
            <Ionicons
              name="bag-add-outline"
              size={14}
              color={GOLD}
              style={styles.addCartIcon}
            />
            <Text style={styles.addCartText}>Add to Cart</Text>
          </PressableScale>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const WishlistScreen = () => {
  const [items, setItems] = useState(WISHLIST);

  const onRemove = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const headerOpacity = useSharedValue(0);
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, []);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="heart-outline" size={40} color={GOLD} />
        </View>

        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>

        <Text style={styles.emptySubtitle}>
          Tap the heart on any item to save it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.View style={[styles.header, headerStyle]}>
        <View>
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.count}>{items.length} saved items</Text>
        </View>

        <View style={styles.headerIconCircle}>
          <Ionicons name="heart" size={18} color={GOLD} />
        </View>
      </Animated.View>

      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <WishlistCard item={item} index={index} onRemove={onRemove} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: { fontSize: 26, fontWeight: '800', color: DARK, marginBottom: 4 },

  count: { fontSize: 13, color: GRAY_TEXT },

  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },

  columnWrapper: { gap: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },

  imageBox: {
    height: 150,
    backgroundColor: '#faf8f3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },

  tagText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },

  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardInfo: { padding: 14 },

  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: DARK,
    marginBottom: 6,
    lineHeight: 18,
  },

  cardPrice: { fontSize: 14, fontWeight: '800', color: GOLD, marginBottom: 10 },

  addCartBtn: {
    backgroundColor: DARK,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCartIcon: { marginRight: 6 },

  addCartText: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },

  emptyIconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyTitle: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 8 },

  emptySubtitle: {
    fontSize: 14,
    color: GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 21,
  },
});

export default WishlistScreen;