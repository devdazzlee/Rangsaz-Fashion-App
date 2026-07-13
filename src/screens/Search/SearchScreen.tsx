import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const { width } = Dimensions.get('window');
const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';
const STORAGE_KEY = 'recentSearches';

// ── Static data ───────────────────────────────────────────
type IconSet = 'ionicon' | 'material' | 'feather';

const TRENDING: { id: string; label: string; iconSet: IconSet; icon: string }[] = [
  { id: 't1', label: 'Bridal Wear', iconSet: 'ionicon', icon: 'heart-outline' },
  { id: 't2', label: 'Lawn Suits', iconSet: 'material', icon: 'flower-outline' },
  { id: 't3', label: 'Embroidered', iconSet: 'ionicon', icon: 'sparkles-outline' },
  { id: 't4', label: 'Chiffon Dupatta', iconSet: 'material', icon: 'tshirt-crew-outline' },
  { id: 't5', label: 'Eid Collection', iconSet: 'ionicon', icon: 'moon-outline' },
  { id: 't6', label: 'Formal Wear', iconSet: 'material', icon: 'diamond-stone' },
  { id: 't7', label: 'Cotton Kameez', iconSet: 'material', icon: 'texture-box' },
  { id: 't8', label: 'Party Wear', iconSet: 'ionicon', icon: 'sparkles' },
];

const CATEGORIES: { id: string; label: string; iconSet: IconSet; icon: string; color: string }[] = [
  { id: 'c1', label: 'Lawn', iconSet: 'material', icon: 'flower-outline', color: '#fce4ec' },
  { id: 'c2', label: 'Bridal', iconSet: 'ionicon', icon: 'heart-outline', color: '#f3e5f5' },
  { id: 'c3', label: 'Formal', iconSet: 'ionicon', icon: 'sparkles-outline', color: '#e8f5e9' },
  { id: 'c4', label: 'Casual', iconSet: 'ionicon', icon: 'shirt-outline', color: '#e3f2fd' },
  { id: 'c5', label: 'Sale', iconSet: 'ionicon', icon: 'pricetag-outline', color: '#fff3e0' },
  { id: 'c6', label: 'Prints', iconSet: 'ionicon', icon: 'color-palette-outline', color: '#fbe9e7' },
];

const ALL_PRODUCTS = [
  { id: '1', name: 'Zari Embroidered Suit', price: 'PKR 8,500', badge: 'NEW', emoji: '👗', category: 'Formal' },
  { id: '2', name: 'Floral Printed Kurta', price: 'PKR 4,200', badge: 'SALE', emoji: '🧣', category: 'Casual' },
  { id: '3', name: 'Bridal Chiffon 3-Piece', price: 'PKR 22,000', badge: 'HOT', emoji: '👰', category: 'Bridal' },
  { id: '4', name: 'Cotton Shalwar Kameez', price: 'PKR 3,800', badge: null, emoji: '🥻', category: 'Casual' },
  { id: '5', name: 'Silk Dupatta', price: 'PKR 2,200', badge: 'NEW', emoji: '🧤', category: 'Formal' },
  { id: '6', name: 'Embroidered Lawn 3-Pc', price: 'PKR 6,500', badge: null, emoji: '🌸', category: 'Lawn' },
  { id: '7', name: 'Chiffon Party Dress', price: 'PKR 12,000', badge: 'HOT', emoji: '👘', category: 'Formal' },
  { id: '8', name: 'Printed Lawn Suit', price: 'PKR 4,800', badge: null, emoji: '🌺', category: 'Lawn' },
  { id: '9', name: 'Heavy Embroidered Lehnga', price: 'PKR 35,000', badge: 'NEW', emoji: '👑', category: 'Bridal' },
  { id: '10', name: 'Casual Cotton Kurti', price: 'PKR 1,800', badge: 'SALE', emoji: '👕', category: 'Casual' },
];

const AppIcon = ({
  iconSet,
  icon,
  size = 16,
  color = DARK,
}: {
  iconSet: IconSet;
  icon: string;
  size?: number;
  color?: string;
}) => {
  if (iconSet === 'material') {
    return <MaterialCommunityIcons name={icon} size={size} color={color} />;
  }
  if (iconSet === 'feather') {
    return <Feather name={icon} size={size} color={color} />;
  }
  return <Ionicons name={icon} size={size} color={color} />;
};

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

// ── Animated section wrapper ──────────────────────────────
const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

// ── Product result card ───────────────────────────────────
const ResultCard = ({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress: () => void;
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(20);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 350 }));
    translateX.value = withDelay(
      index * 60,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withTiming(1, { duration: 100 }),
    );
    setTimeout(onPress, 100);
  };

  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity
        style={styles.resultCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.resultImage}>
          {item.badge && (
            <View
              style={[
                styles.resultBadge,
                { backgroundColor: item.badge === 'SALE' ? '#d32f2f' : DARK },
              ]}
            >
              <Text style={styles.resultBadgeText}>{item.badge}</Text>
            </View>
          )}
          <Ionicons name="shirt-outline" size={28} color="#D8CBA0" />
        </View>

        <View style={styles.resultInfo}>
          <Text style={styles.resultCategory}>{item.category}</Text>
          <Text style={styles.resultName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.resultPrice}>{item.price}</Text>
        </View>

        <TouchableOpacity style={styles.resultCartBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Ionicons name="add" size={18} color={GOLD} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Main Screen ───────────────────────────────────────────
const SearchScreen = ({ navigation }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof ALL_PRODUCTS>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const searchBarScale = useSharedValue(0.96);
  const searchBarOpacity = useSharedValue(0);
  const clearBtnOpacity = useSharedValue(0);
  const resultsOpacity = useSharedValue(0);

  // Focus input on mount
  useEffect(() => {
    searchBarOpacity.value = withTiming(1, { duration: 300 });
    searchBarScale.value = withSpring(1, { damping: 14 });
    setTimeout(() => inputRef.current?.focus(), 400);
    loadRecentSearches();
  }, []);

  const searchBarStyle = useAnimatedStyle(() => ({
    opacity: searchBarOpacity.value,
    transform: [{ scale: searchBarScale.value }],
  }));

  const clearBtnStyle = useAnimatedStyle(() => ({
    opacity: clearBtnOpacity.value,
  }));

  const resultsStyle = useAnimatedStyle(() => ({
    opacity: resultsOpacity.value,
  }));

  // Load recent searches from storage
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (_) {}
  };

  const saveRecentSearch = async (text: string) => {
    try {
      const updated = [
        text,
        ...recentSearches.filter(s => s !== text),
      ].slice(0, 8);
      setRecentSearches(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  const removeRecentSearch = async (text: string) => {
    const updated = recentSearches.filter(s => s !== text);
    setRecentSearches(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAllRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  // Search logic
  const performSearch = useCallback(
    (text: string) => {
      if (!text.trim()) {
        setResults([]);
        setIsSearching(false);
        setNoResults(false);
        resultsOpacity.value = withTiming(0, { duration: 200 });
        return;
      }

      setIsSearching(true);
      const filtered = ALL_PRODUCTS.filter(
        p =>
          p.name.toLowerCase().includes(text.toLowerCase()) ||
          p.category.toLowerCase().includes(text.toLowerCase()),
      );

      setTimeout(() => {
        setResults(filtered);
        setNoResults(filtered.length === 0);
        setIsSearching(false);
        resultsOpacity.value = withTiming(1, { duration: 300 });
      }, 300);
    },
    [recentSearches],
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    clearBtnOpacity.value = withTiming(text.length > 0 ? 1 : 0, { duration: 200 });
    performSearch(text);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      Keyboard.dismiss();
    }
  };

  const handleRecentTap = (text: string) => {
    setQuery(text);
    clearBtnOpacity.value = withTiming(1, { duration: 200 });
    performSearch(text);
    saveRecentSearch(text);
  };

  const handleTrendingTap = (label: string) => {
    setQuery(label);
    clearBtnOpacity.value = withTiming(1, { duration: 200 });
    performSearch(label);
    saveRecentSearch(label);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    setNoResults(false);
    clearBtnOpacity.value = withTiming(0, { duration: 200 });
    resultsOpacity.value = withTiming(0, { duration: 200 });
    inputRef.current?.focus();
  };

  const handleProductPress = (item: any) => {
    navigation.navigate('ProductDetail', {
      id: item.id,
      name: item.name,
      price: item.price,
      emoji: item.emoji,
      badge: item.badge,
    });
  };

  const showDefault = query.length === 0;
  const showResults = query.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <PressableScale style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={19} color={DARK} />
        </PressableScale>

        {/* Search bar */}
        <Animated.View style={[styles.searchBar, searchBarStyle]}>
          <Feather name="search" size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search dresses, categories..."
            placeholderTextColor="#bbb"
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCapitalize="none"
          />
          <Animated.View style={clearBtnStyle}>
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <Ionicons name="close" size={13} color="#666" />
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Default state ── */}
        {showDefault && (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <FadeIn delay={0}>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearAllRecent}>
                      <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.recentRow}
                      onPress={() => handleRecentTap(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.recentIconWrap}>
                        <Feather name="clock" size={14} color="#999" />
                      </View>
                      <Text style={styles.recentText}>{item}</Text>
                      <TouchableOpacity
                        onPress={() => removeRecentSearch(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="close" size={15} color="#ccc" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </FadeIn>
            )}

            {/* Browse categories */}
            <FadeIn delay={100}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryCard, { backgroundColor: cat.color }]}
                      onPress={() => handleTrendingTap(cat.label)}
                      activeOpacity={0.8}
                    >
                      <AppIcon
                        iconSet={cat.iconSet}
                        icon={cat.icon}
                        size={24}
                        color={DARK}
                      />
                      <Text style={styles.categoryCardLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </FadeIn>

            {/* Trending */}
            <FadeIn delay={200}>
              <View style={styles.section}>
                <View style={styles.trendingTitleRow}>
                  <Ionicons name="flame" size={16} color={GOLD} />
                  <Text style={[styles.sectionTitle, styles.trendingTitleText]}>
                    Trending Now
                  </Text>
                </View>
                <View style={styles.trendingWrap}>
                  {TRENDING.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.trendingChip}
                      onPress={() => handleTrendingTap(item.label)}
                      activeOpacity={0.8}
                    >
                      <AppIcon
                        iconSet={item.iconSet}
                        icon={item.icon}
                        size={14}
                        color={GOLD}
                      />
                      <Text style={styles.trendingLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </FadeIn>
          </>
        )}

        {/* ── Searching indicator ── */}
        {isSearching && (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* ── Results ── */}
        {showResults && !isSearching && (
          <Animated.View style={resultsStyle}>
            {/* Results header */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {noResults
                  ? 'No results found'
                  : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
              </Text>
              {!noResults && (
                <TouchableOpacity style={styles.filterBtn}>
                  <Feather name="sliders" size={12} color={DARK} style={styles.filterBtnIcon} />
                  <Text style={styles.filterBtnText}>Filter</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* No results */}
            {noResults && (
              <FadeIn delay={0}>
                <View style={styles.noResultsBox}>
                  <View style={styles.noResultsIconCircle}>
                    <Feather name="search" size={30} color={GOLD} />
                  </View>
                  <Text style={styles.noResultsTitle}>
                    No results for "{query}"
                  </Text>
                  <Text style={styles.noResultsSub}>
                    Try a different keyword or browse categories below
                  </Text>
                  <View style={styles.trendingWrap}>
                    {TRENDING.slice(0, 4).map(item => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.trendingChip}
                        onPress={() => handleTrendingTap(item.label)}
                      >
                        <AppIcon
                          iconSet={item.iconSet}
                          icon={item.icon}
                          size={14}
                          color={GOLD}
                        />
                        <Text style={styles.trendingLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </FadeIn>
            )}

            {/* Result cards */}
            {!noResults &&
              results.map((item, index) => (
                <ResultCard
                  key={item.id}
                  item={item}
                  index={index}
                  onPress={() => handleProductPress(item)}
                />
              ))}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search bar
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: DARK, paddingVertical: 12 },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scrollContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 40 },

  // Section
  section: { marginBottom: 26 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: DARK, marginBottom: 14 },
  clearAllText: { fontSize: 12, color: GOLD, fontWeight: '700' },

  trendingTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  trendingTitleText: { marginBottom: 0 },

  // Recent
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    gap: 12,
  },
  recentIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: { flex: 1, fontSize: 14, color: DARK, fontWeight: '500' },

  // Categories grid
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: {
    width: (width - 52) / 3,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryCardLabel: { fontSize: 12, fontWeight: '700', color: DARK },

  // Trending
  trendingWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: GOLD_SOFT,
    borderWidth: 1,
    borderColor: '#EFE1A9',
  },
  trendingLabel: { fontSize: 13, fontWeight: '600', color: DARK },

  // Loading
  loadingBox: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { fontSize: 14, color: '#aaa', fontWeight: '500' },

  // Results header
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultsCount: { fontSize: 13, color: GRAY_TEXT, fontWeight: '500' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: BORDER,
  },
  filterBtnIcon: { marginRight: 6 },
  filterBtnText: { fontSize: 12, fontWeight: '600', color: DARK },

  // No results
  noResultsBox: { alignItems: 'center', paddingVertical: 32 },
  noResultsIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  noResultsTitle: { fontSize: 17, fontWeight: '800', color: DARK, marginBottom: 8 },
  noResultsSub: {
    fontSize: 13,
    color: GRAY_TEXT,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  // Result card
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#faf8f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
  },
  resultBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 2,
  },
  resultBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  resultInfo: { flex: 1 },
  resultCategory: { fontSize: 10, fontWeight: '700', color: GOLD, letterSpacing: 0.5, marginBottom: 3 },
  resultName: { fontSize: 13, fontWeight: '700', color: DARK, marginBottom: 5, lineHeight: 18 },
  resultPrice: { fontSize: 13, fontWeight: '800', color: DARK },
  resultCartBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default SearchScreen;