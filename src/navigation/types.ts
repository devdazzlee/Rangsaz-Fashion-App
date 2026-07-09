export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    MainTabs: undefined;
    ProductDetail: {
      id: string;
      name: string;
      price: string;
      emoji: string;
      badge?: string | null;
    };
  };


  export type TabParamList = {
    Home: undefined;
    Shop: undefined;
    Cart: undefined;
    Wishlist: undefined;
    Profile: undefined;
  };
  