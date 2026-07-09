import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import type { TabParamList } from './types';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import ShopScreen from '../screens/Shop/ShopScreen';
import CartScreen from '../screens/Cart/CartScreen';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const GOLD = '#C9A227';
const DARK = '#0d0d0d';
const INACTIVE = '#aaa';

// Tab config: name, icon (active), icon (inactive), label
const TAB_CONFIG = [
  { name: 'Home',     iconActive: 'home',          iconInactive: 'home-outline',          label: 'Home'     },
  { name: 'Shop',     iconActive: 'grid',           iconInactive: 'grid-outline',           label: 'Shop'     },
  { name: 'Cart',     iconActive: 'bag',            iconInactive: 'bag-outline',            label: 'Cart'     },
  { name: 'Wishlist', iconActive: 'heart',          iconInactive: 'heart-outline',          label: 'Wishlist' },
  { name: 'Profile',  iconActive: 'person',         iconInactive: 'person-outline',         label: 'Profile'  },
];

// Custom tab bar
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Cart tab gets a special center raised button
        if (route.name === 'Cart') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.cartButton}
              activeOpacity={0.85}
            >
              <View style={styles.cartInner}>
                <Icon name={isFocused ? 'bag' : 'bag-outline'} size={26} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Icon
              name={isFocused ? config.iconActive : config.iconInactive}
              size={22}
              color={isFocused ? GOLD : INACTIVE}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {config.label}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     />
      <Tab.Screen name="Shop"     component={ShopScreen}     />
      <Tab.Screen name="Cart"     component={CartScreen}     />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen}  />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: Platform.OS === 'ios' ? 82 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    color: INACTIVE,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: GOLD,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
  },
  // Cart center button
  cartButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28, // raised above tab bar
  },
  cartInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
});

export default TabNavigator;