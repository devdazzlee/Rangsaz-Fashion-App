import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, Dimensions
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<          
  BottomTabScreenProps<TabParamList, 'Cart'>, 
  NativeStackScreenProps<RootStackParamList>  
>;                                            

const GOLD = '#C9A227';
const DARK = '#0d0d0d';
const LIGHT_BG = '#F9F9FA';
const ACCENT_GRAY = '#EAEAEA';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INITIAL_CART = [
  { id: '1', name: 'Zari Embroidered Suit', price: 8500,  qty: 1, emoji: '👗' },
  { id: '2', name: 'Silk Dupatta',          price: 2200,  qty: 2, emoji: '🧤' },
  { id: '3', name: 'Floral Printed Kurta',  price: 4200,  qty: 1, emoji: '🧣' },
];

// Fully type-safe luxury icon map helper
const renderProductIcon = (emoji: string) => {
  switch (emoji) {
    case '👗':
      return <MaterialCommunityIcons name="woman-style" size={28} color={DARK} />;
    case '🧤':
      return <MaterialCommunityIcons name="sparkles" size={26} color={DARK} />;
    case '🧣':
      return <Feather name="layers" size={24} color={DARK} />;
    default:
      return <Feather name="shopping-bag" size={24} color={DARK} />;
  }
};

const CartItem = ({ item, onIncrease, onDecrease, onRemove, index }: any) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(index * 80, withSpring(0, { damping: 14 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.cartItemCard, animatedStyle]}>
      <View style={styles.itemImageBox}>
        {renderProductIcon(item.emoji)}
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.itemHeaderRow}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.removeBtn} 
            onPress={() => onRemove(item.id)}
            activeOpacity={0.7}
          >
            <Feather name="x" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>PKR {(item.price * item.qty).toLocaleString()}</Text>
        
        <View style={styles.qtyRowAction}>
          <Text style={styles.singleItemValue}>PKR {item.price.toLocaleString()} each</Text>
          <View style={styles.qtySelector}>
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={() => onDecrease(item.id)}
              activeOpacity={0.6}
            >
              <Feather name="minus" size={14} color={DARK} />
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{item.qty}</Text>
            
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={() => onIncrease(item.id)}
              activeOpacity={0.6}
            >
              <Feather name="plus" size={14} color={DARK} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const CartScreen = ({ navigation }: Props) => {
  const [cart, setCart] = useState(INITIAL_CART);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const onIncrease = (id: string) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));

  const onDecrease = (id: string) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));

  const onRemove = (id: string) =>
    setCart(prev => prev.filter(i => i.id !== id));

  const summaryOpacity = useSharedValue(0);
  const summaryTranslateY = useSharedValue(40);

  useEffect(() => {
    if (cart.length > 0) {
      summaryOpacity.value = withDelay(250, withTiming(1, { duration: 500 }));
      summaryTranslateY.value = withDelay(250, withSpring(0, { damping: 15 }));
    }
  }, [cart.length]);

  const summaryStyle = useAnimatedStyle(() => ({
    opacity: summaryOpacity.value,
    transform: [{ translateY: summaryTranslateY.value }]
  }));

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.emptyIconContainer}>
          <Feather name="shopping-bag" size={48} color={GOLD} />
        </View>
        <Text style={styles.emptyTitle}>Your Atelier Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Curate your wardrobe with our signature premium collections.</Text>
        <TouchableOpacity 
          style={styles.continueShoppingBtn}
          activeOpacity={0.9}
          onPress={() => { /* Functionality structurally preserved unchanged */ }}
        >
          <Text style={styles.continueShoppingText}>EXPLORE PIECES</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Luxury Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={DARK} />
        </TouchableOpacity>
        <View style={styles.titleCenterContainer}>
          <Text style={styles.title}>SHOPPING BAG</Text>
          <Text style={styles.itemCount}>{cart.length} {cart.length === 1 ? 'PIECE' : 'PIECES'}</Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
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

      {/* Premium Sticky Absolute Drawer Summary */}
      <Animated.View style={[styles.summary, summaryStyle]}>
        <View style={styles.summaryIndicator} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>PKR {total.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: '#B38A1D', fontWeight: '600' }]}>COMPLIMENTARY</Text>
        </View>
        
        <View style={styles.totalRowLine} />
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Estimated</Text>
          <Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
          <Feather name="arrow-right" size={16} color="#fff" style={styles.checkoutArrow} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: DARK, 
    letterSpacing: 2,
    fontFamily: 'System'
  },
  itemCount: { 
    fontSize: 11, 
    color: '#8A8A8F', 
    fontWeight: '500', 
    marginTop: 2,
    letterSpacing: 0.5
  },
  headerRightPlaceholder: {
    width: 40,
  },
  listContainer: {
    paddingHorizontal: 24, 
    paddingTop: 24,
    paddingBottom: 260 
  },
  cartItemCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowOffset: { width: 0, height: 10 }, 
    shadowRadius: 20, 
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F2F4'
  },
  itemImageBox: { 
    width: 90, 
    height: 105, 
    borderRadius: 14, 
    backgroundColor: LIGHT_BG, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F0F0F2'
  },
  itemDetails: { 
    flex: 1,
    justifyContent: 'space-between'
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: DARK, 
    letterSpacing: 0.3,
    flex: 1,
    paddingRight: 8
  },
  itemPrice: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: DARK,
    marginTop: 4
  },
  qtyRowAction: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: 12
  },
  singleItemValue: {
    fontSize: 12,
    color: '#8A8A8F',
    fontWeight: '400'
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BG,
    borderRadius: 100,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA'
  },
  qtyBtn: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1
  },
  qtyText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: DARK, 
    paddingHorizontal: 12,
    textAlign: 'center' 
  },
  removeBtn: { 
    padding: 6,
    borderRadius: 100,
    backgroundColor: '#F5F5F7'
  },
  summary: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 34, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowOffset: { width: 0, height: -10 }, 
    shadowRadius: 24, 
    elevation: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#F5F5F5' 
  },
  summaryIndicator: {
    width: 36,
    height: 4,
    backgroundColor: ACCENT_GRAY,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 14 
  },
  summaryLabel: { 
    fontSize: 14, 
    color: '#666',
    fontWeight: '400',
    letterSpacing: 0.2
  },
  summaryValue: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: DARK 
  },
  totalRowLine: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 6
  },
  totalRow: { 
    alignItems: 'center',
    marginBottom: 24 
  },
  totalLabel: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: DARK,
    letterSpacing: 0.2
  },
  totalValue: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: GOLD 
  },
  checkoutBtn: { 
    backgroundColor: DARK, 
    borderRadius: 18, 
    paddingVertical: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: DARK, 
    shadowOpacity: 0.15, 
    shadowOffset: { width: 0, height: 8 }, 
    shadowRadius: 16, 
    elevation: 4 
  },
  checkoutText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 13, 
    letterSpacing: 2,
    transform: [{ translateX: 8 }]
  },
  checkoutArrow: {
    marginLeft: 12,
    transform: [{ translateX: 8 }]
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff',
    paddingHorizontal: 40
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LIGHT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F2F2F4'
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: DARK, 
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: 'center'
  },
  emptySubtitle: { 
    fontSize: 13, 
    color: '#8A8A8F',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32
  },
  continueShoppingBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: DARK,
    backgroundColor: '#fff'
  },
  continueShoppingText: {
    fontSize: 12,
    fontWeight: '700',
    color: DARK,
    letterSpacing: 1.5
  }
});

export default CartScreen;