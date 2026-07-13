import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PaymentMethods'
>;

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

const CARDS = [
  {
    type: 'VISA',
    number: '**** **** **** 4589',
    holder: 'Ahmed Raza',
    expiry: '12/29',
    color1: '#222',
    color2: '#111',
  },
  {
    type: 'MasterCard',
    number: '**** **** **** 8832',
    holder: 'Ahmed Raza',
    expiry: '08/28',
    color1: '#444',
    color2: '#222',
  },
];

const OPTIONS: { label: string; icon: string }[] = [
  { label: 'Cash on Delivery', icon: 'cash-outline' },
  { label: 'Debit Card', icon: 'card-outline' },
  { label: 'Credit Card', icon: 'card' },
  { label: 'Google Pay', icon: 'logo-google' },
  { label: 'Apple Pay', icon: 'logo-apple' },
];

const FAQS = [
  {
    q: 'Can I pay with Cash on Delivery?',
    a: 'Yes. Cash on Delivery is available for selected cities.',
  },
  {
    q: 'How can I add a new card?',
    a: 'Tap the Add New Card button and enter your card information securely.',
  },
  {
    q: 'How do refunds work?',
    a: 'Refunds are processed to your original payment method within 5–7 business days.',
  },
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
        scale.value = withTiming(0.96, { duration: 100 });
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

const PaymentMethodsScreen = ({ navigation }: Props) => {
  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(24);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 600 });
    heroTranslateY.value = withDelay(80, withTiming(0, { duration: 600 }));
  }, []);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#ffffff', '#faf8f3']}
          style={styles.hero}
        >
          <View style={styles.headerRowTop}>
            <PressableScale
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color={DARK} />
            </PressableScale>

            <Text style={styles.headerLabel}>Wallet</Text>

            <View style={styles.backButtonPlaceholder} />
          </View>

          <Animated.View style={heroAnimatedStyle}>
            <View style={styles.heroIconWrap}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="card" size={36} color={GOLD} />
              </View>
            </View>

            <Text style={styles.heroTitle}>Payment Methods</Text>

            <Text style={styles.heroSubtitle}>
              Manage your cards and payment options securely.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>

          {CARDS.map((card, index) => (
            <Animated.View
              key={card.number}
              entering={FadeInDown.delay(100 + index * 80)
                .springify()
                .damping(16)}
            >
              <LinearGradient
                colors={[card.color1, card.color2]}
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardType}>{card.type}</Text>

                  <MaterialCommunityIcons
                    name="integrated-circuit-chip"
                    size={28}
                    color={GOLD}
                  />
                </View>

                <Text style={styles.cardNumber}>{card.number}</Text>

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.smallLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardHolder}>{card.holder}</Text>
                  </View>

                  <View>
                    <Text style={styles.smallLabel}>EXPIRES</Text>
                    <Text style={styles.cardHolder}>{card.expiry}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}

          <PressableScale style={styles.addCardBtn}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#fff"
              style={styles.addCardIcon}
            />
            <Text style={styles.addCardText}>Add New Card</Text>
          </PressableScale>

          <Text style={styles.sectionTitle}>Available Payment Options</Text>

          {OPTIONS.map((option, index) => (
            <Animated.View
              key={option.label}
              entering={FadeInDown.delay(220 + index * 60)
                .springify()
                .damping(18)}
              style={styles.optionCard}
            >
              <View style={styles.optionIconWrap}>
                <Ionicons name={option.icon} size={20} color={DARK} />
              </View>

              <Text style={styles.optionText}>{option.label}</Text>

              <Ionicons
                name="checkmark-circle"
                size={20}
                color={GOLD}
                style={styles.optionCheck}
              />
            </Animated.View>
          ))}

          <Text style={styles.sectionTitle}>Payment Security</Text>

          <Animated.View
            entering={FadeInDown.delay(280).springify().damping(16)}
            style={styles.securityCard}
          >
            <View style={styles.securityIconCircle}>
              <Ionicons name="shield-checkmark" size={30} color={GOLD} />
            </View>

            <Text style={styles.securityTitle}>Secure Checkout</Text>

            <Text style={styles.securityText}>
              All payments are protected with industry-standard SSL
              encryption. Your card information is never stored on your
              device.
            </Text>
          </Animated.View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {FAQS.map((item, index) => (
            <Animated.View
              key={item.q}
              entering={FadeInDown.delay(340 + index * 60)
                .springify()
                .damping(18)}
              style={styles.faqCard}
            >
              <View style={styles.faqHeaderRow}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={18}
                  color={GOLD}
                  style={styles.faqIcon}
                />
                <Text style={styles.faqQuestion}>{item.q}</Text>
              </View>

              <Text style={styles.faqAnswer}>{item.a}</Text>
            </Animated.View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Need help with a payment?</Text>

            <PressableScale style={styles.supportButton}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color={GOLD}
                style={styles.supportIcon}
              />
              <Text style={styles.supportText}>Contact Support</Text>
            </PressableScale>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethodsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContent: {
    paddingBottom: 48,
  },

  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  headerRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  backButtonPlaceholder: {
    width: 42,
    height: 42,
  },

  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#999',
    textTransform: 'uppercase',
  },

  heroIconWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },

  heroIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE1A9',
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: DARK,
    textAlign: 'center',
    marginBottom: 10,
  },

  heroSubtitle: {
    textAlign: 'center',
    color: GRAY_TEXT,
    fontSize: 15,
    lineHeight: 23,
    paddingHorizontal: 12,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: DARK,
    marginBottom: 16,
    marginTop: 8,
  },

  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },

  cardType: {
    color: GOLD,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },

  cardNumber: {
    color: '#fff',
    fontSize: 21,
    letterSpacing: 3,
    marginBottom: 32,
    fontWeight: '700',
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallLabel: {
    color: '#999',
    fontSize: 10,
    marginBottom: 6,
    letterSpacing: 1,
  },

  cardHolder: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  addCardBtn: {
    backgroundColor: GOLD,
    borderRadius: 18,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 32,

    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  addCardIcon: {
    marginRight: 8,
  },

  addCardText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf8f3',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f2e7b8',
  },

  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: DARK,
    fontWeight: '600',
  },

  optionCheck: {
    marginLeft: 8,
  },

  securityCard: {
    backgroundColor: '#faf8f3',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0e2aa',
  },

  securityIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  securityTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: DARK,
    marginBottom: 10,
  },

  securityText: {
    color: GRAY_TEXT,
    lineHeight: 23,
    textAlign: 'center',
    fontSize: 15,
  },

  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  faqIcon: {
    marginRight: 8,
    marginTop: 2,
  },

  faqQuestion: {
    flex: 1,
    fontWeight: '700',
    color: DARK,
    fontSize: 16,
  },

  faqAnswer: {
    color: GRAY_TEXT,
    lineHeight: 23,
    fontSize: 14,
    marginLeft: 26,
  },

  footer: {
    marginTop: 28,
    marginBottom: 24,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 16,
    color: GRAY_TEXT,
    marginBottom: 18,
  },

  supportButton: {
    backgroundColor: DARK,
    paddingVertical: 17,
    paddingHorizontal: 36,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  supportIcon: {
    marginRight: 8,
  },

  supportText: {
    color: GOLD,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});