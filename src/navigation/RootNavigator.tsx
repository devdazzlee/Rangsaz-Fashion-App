import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Auth/Login/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import SignupScreen from '../screens/Auth/Signup/SignupScreen';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetail/ProductDetailScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import OrderSuccessScreen from '../screens/Checkout/OrderSuccessScreen';
import OrderTrackingScreen from '../screens/OrderTracking/OrderTrackingScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import MyOrdersScreen from '../screens/Orders/MyOrdersScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword/ForgotPasswordScreen';
import AddressesScreen from '../screens/Addresses/AddressesScreen';
import PaymentMethodsScreen from '../screens/Profile/PaymentMethodsScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import HelpSupportScreen from '../screens/Profile/HelpSupportScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Addresses" component={AddressesScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
