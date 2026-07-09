import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
} from 'react-native-reanimated';

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const INITIAL_CART = [
  { id: '1', name: 'Zari Embroidered Suit',  price: 8500,  qty: 1, emoji: '👗' },
  { id: '2', name: 'Silk Dupatta',           price: 2200,  qty: 2, emoji: '🧤' },
  { id: '3', name: 'Floral Printed Kurta',   price: 4200,  qty: 1, emoji: '🧣' },
];

const CartItem = ({ item, onIncrease, onDecrease, onRemove, index }: any) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.cartItem, style]}>
      <View style={styles.itemImageBox}>
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemPrice}>PKR {(item.price * item.qty).toLocaleString()}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecrease(item.id)}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onIncrease(item.id)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(item.id)}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CartScreen = () => {
  const [cart, setCart] = useState(INITIAL_CART);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const onIncrease = (id: string) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));

  const onDecrease = (id: string) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));

  const onRemove = (id: string) =>
    setCart(prev => prev.filter(i => i.id !== id));

  const summaryOpacity = useSharedValue(0);
  useEffect(() => {
    summaryOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);
  const summaryStyle = useAnimatedStyle(() => ({ opacity: summaryOpacity.value }));

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛍️</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some beautiful dresses!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>{cart.length} items</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CartItem
            item={item}
            index={index}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        )}
      />

      {/* Order Summary */}
      <Animated.View style={[styles.summary, summaryStyle]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>PKR {total.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: '#2e7d32' }]}>FREE</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: DARK },
  itemCount: { fontSize: 13, color: '#888', fontWeight: '500' },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 2 },
  itemImageBox: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemEmoji: { fontSize: 32 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '600', color: DARK, marginBottom: 4, lineHeight: 18 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: GOLD, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 16, color: DARK, fontWeight: '700', lineHeight: 20 },
  qtyText: { fontSize: 14, fontWeight: '700', color: DARK, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4, alignSelf: 'flex-start' },
  removeText: { fontSize: 12, color: '#aaa' },
  summary: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12, elevation: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: DARK },
  totalRow: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: DARK },
  totalValue: { fontSize: 16, fontWeight: '800', color: GOLD },
  checkoutBtn: { backgroundColor: DARK, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  checkoutText: { color: GOLD, fontWeight: '800', fontSize: 13, letterSpacing: 2 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: DARK, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888' },
});

export default CartScreen;