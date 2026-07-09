import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Dimensions, StatusBar, TextInput,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<TabParamList, 'Shop'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const FILTERS = ['All', 'Lawn', 'Formal', 'Bridal', 'Casual', 'Sale'];
const PRODUCTS = [
  { id: '1',  name: 'Zari Embroidered Suit',    price: 'PKR 8,500',  badge: 'NEW',  emoji: '👗' },
  { id: '2',  name: 'Floral Printed Kurta',     price: 'PKR 4,200',  badge: 'SALE', emoji: '🧣' },
  { id: '3',  name: 'Bridal Chiffon 3-Piece',   price: 'PKR 22,000', badge: 'HOT',  emoji: '👰' },
  { id: '4',  name: 'Cotton Shalwar Kameez',    price: 'PKR 3,800',  badge: null,   emoji: '🥻' },
  { id: '5',  name: 'Silk Dupatta',             price: 'PKR 2,200',  badge: 'NEW',  emoji: '🧤' },
  { id: '6',  name: 'Embroidered Lawn 3-Pc',    price: 'PKR 6,500',  badge: null,   emoji: '🌸' },
];

const AnimatedCard = ({ item, index, navigation }: { item: any; index: number; navigation: any }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 80, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ width: (width - 44) / 2 }, style]}>
    <TouchableOpacity
  style={styles.productCard}
  activeOpacity={0.85}
  onPress={() => navigation.navigate('ProductDetail', {
    id: item.id,
    name: item.name,
    price: item.price,
    emoji: item.emoji,
    badge: item.badge,
  })}
>
        <View style={styles.productImage}>
          {item.badge && (
            <View style={[styles.badge, { backgroundColor: item.badge === 'SALE' ? '#d32f2f' : DARK }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.wishlistBtn}>
            <Text>🤍</Text>
          </TouchableOpacity>
          <Text style={styles.productEmoji}>{item.emoji}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{item.price}</Text>
            <TouchableOpacity style={styles.cartBtn}>
              <Text style={styles.cartBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ShopScreen = ({ navigation }: Props) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const headerOpacity = useSharedValue(0);
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
  }, []);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dresses..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <AnimatedCard item={item} index={index} navigation={navigation} />}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800', color: DARK, marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: DARK },
  filtersRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee' },
  filterChipActive: { backgroundColor: DARK, borderColor: DARK },
  filterText: { fontSize: 12, fontWeight: '600', color: '#666' },
  filterTextActive: { color: GOLD },
  grid: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  productCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3, marginBottom: 12 },
  productImage: { height: 150, backgroundColor: '#faf8f3', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  wishlistBtn: { position: 'absolute', top: 8, right: 8 },
  productEmoji: { fontSize: 52 },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, fontWeight: '600', color: DARK, marginBottom: 8, lineHeight: 17 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 12, fontWeight: '800', color: GOLD },
  cartBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: DARK, alignItems: 'center', justifyContent: 'center' },
  cartBtnText: { color: '#fff', fontSize: 16, fontWeight: '600', lineHeight: 20 },
});

export default ShopScreen;