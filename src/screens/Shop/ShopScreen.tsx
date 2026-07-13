import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  ScrollView,
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<TabParamList, 'Shop'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

const FILTERS = ['All', 'Lawn', 'Formal', 'Bridal', 'Casual', 'Sale'];
const PRODUCTS = [
  { id: '1', name: 'Zari Embroidered Suit', price: 'PKR 8,500', badge: 'NEW', emoji: '👗' },
  { id: '2', name: 'Floral Printed Kurta', price: 'PKR 4,200', badge: 'SALE', emoji: '🧣' },
  { id: '3', name: 'Bridal Chiffon 3-Piece', price: 'PKR 22,000', badge: 'HOT', emoji: '👰' },
  { id: '4', name: 'Cotton Shalwar Kameez', price: 'PKR 3,800', badge: null, emoji: '🥻' },
  { id: '5', name: 'Silk Dupatta', price: 'PKR 2,200', badge: 'NEW', emoji: '🧤' },
  { id: '6', name: 'Embroidered Lawn 3-Pc', price: 'PKR 6,500', badge: null, emoji: '🌸' },
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

const AnimatedCard = ({
  item,
  index,
  navigation,
}: {
  item: any;
  index: number;
  navigation: any;
}) => {
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
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            id: item.id,
            name: item.name,
            price: item.price,
            emoji: item.emoji,
            badge: item.badge,
          })
        }
      >
        <View style={styles.productImage}>
          {item.badge && (
            <View
              style={[
                styles.badge,
                { backgroundColor: item.badge === 'SALE' ? '#d32f2f' : DARK },
              ]}
            >
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.wishlistBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="heart-outline" size={16} color={DARK} />
          </TouchableOpacity>

          <View style={styles.imagePlaceholder}>
            <Ionicons name="shirt-outline" size={44} color="#D8CBA0" />
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{item.price}</Text>

            <TouchableOpacity style={styles.cartBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="add" size={16} color="#fff" />
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
          <Feather
            name="search"
            size={16}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dresses..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                activeFilter === f && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedCard item={item} index={index} navigation={navigation} />
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
    paddingBottom: 8,
    backgroundColor: '#fff',
  },

  title: { fontSize: 27, fontWeight: '800', color: DARK, marginBottom: 16 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },

  searchIcon: { marginRight: 10 },

  searchInput: { flex: 1, fontSize: 14, color: DARK },

  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: BORDER,
  },

  filterChipActive: { backgroundColor: DARK, borderColor: DARK },

  filterText: { fontSize: 12, fontWeight: '600', color: GRAY_TEXT },

  filterTextActive: { color: GOLD },

  grid: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },

  columnWrapper: { gap: 12 },

  productCard: {
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

  productImage: {
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

  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },

  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
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

  cartBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShopScreen;