import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Dimensions, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const WISHLIST = [
  { id: '1', name: 'Bridal Chiffon 3-Piece',  price: 'PKR 22,000', emoji: '👰', tag: 'HOT' },
  { id: '2', name: 'Zari Embroidered Suit',    price: 'PKR 8,500',  emoji: '👗', tag: 'NEW' },
  { id: '3', name: 'Embroidered Lawn 3-Pc',    price: 'PKR 6,500',  emoji: '🌸', tag: null  },
  { id: '4', name: 'Silk Dupatta',             price: 'PKR 2,200',  emoji: '🧤', tag: 'SALE' },
];

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
      <TouchableOpacity style={styles.card} activeOpacity={0.85}>
        <View style={styles.imageBox}>
          {item.tag && (
            <View style={[styles.tag, { backgroundColor: item.tag === 'SALE' ? '#d32f2f' : DARK }]}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.heartBtn} onPress={handleRemove}>
            <Animated.Text style={[styles.heartIcon, heartStyle]}>❤️</Animated.Text>
          </TouchableOpacity>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.addCartBtn}>
            <Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const WishlistScreen = () => {
  const [items, setItems] = useState(WISHLIST);

  const onRemove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const headerOpacity = useSharedValue(0);
  useEffect(() => { headerOpacity.value = withTiming(1, { duration: 400 }); }, []);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🤍</Text>
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptySubtitle}>Tap ❤️ on any item to save it here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.count}>{items.length} saved items</Text>
      </Animated.View>
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
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
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: DARK },
  count: { fontSize: 13, color: '#888' },
  grid: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3, marginBottom: 12 },
  imageBox: { height: 150, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tag: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  heartBtn: { position: 'absolute', top: 8, right: 8 },
  heartIcon: { fontSize: 18 },
  emoji: { fontSize: 52 },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 12, fontWeight: '600', color: DARK, marginBottom: 4, lineHeight: 17 },
  cardPrice: { fontSize: 12, fontWeight: '800', color: GOLD, marginBottom: 8 },
  addCartBtn: { backgroundColor: DARK, borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  addCartText: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center' },
});

export default WishlistScreen;