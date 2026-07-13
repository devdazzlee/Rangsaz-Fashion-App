export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  MainTabs: undefined;
  ProductDetail: {
    id: string;
    name: string;
    price: string;
    emoji: string;
    badge?: string | null;
  };
  Checkout: undefined;
  OrderSuccess: undefined;
  OrderTracking: {
    orderId: string;
  };
  EditProfile: undefined;
  Search: undefined;
  MyOrders: undefined;
  Notifications: undefined;
  Addresses: undefined;

  PaymentMethods: undefined;
  PrivacyPolicy: undefined;
  HelpSupport: undefined
};

export type TabParamList = {
  Home: undefined;
  Shop: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};
