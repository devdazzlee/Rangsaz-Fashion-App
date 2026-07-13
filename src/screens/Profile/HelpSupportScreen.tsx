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
  'HelpSupport'
>;

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

const CONTACTS: { icon: string; title: string; value: string; desc: string }[] = [
  {
    icon: 'call-outline',
    title: 'Call Us',
    value: '+92 300 1234567',
    desc: 'Mon - Sat (9:00 AM - 7:00 PM)',
  },
  {
    icon: 'mail-outline',
    title: 'Email',
    value: 'support@rangsazfashion.com',
    desc: 'Reply within 24 hours',
  },
  {
    icon: 'logo-whatsapp',
    title: 'WhatsApp',
    value: '+92 300 1234567',
    desc: 'Instant customer support',
  },
];

const FAQS = [
  {
    q: 'How can I track my order?',
    a: 'Open My Orders from your profile and tap on the order you want to track.',
  },
  {
    q: 'How do I cancel an order?',
    a: 'Orders can be cancelled before they are shipped.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Usually 3–5 business days across Pakistan.',
  },
  {
    q: 'Can I return a product?',
    a: 'Yes. Returns are accepted within 7 days of delivery.',
  },
  {
    q: 'How do refunds work?',
    a: 'Refunds are processed within 5–7 business days.',
  },
  {
    q: 'Can I change my delivery address?',
    a: 'Yes, before the order is dispatched.',
  },
  {
    q: 'Are my payments secure?',
    a: 'Absolutely. We use secure encrypted payment gateways.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can call, email, or WhatsApp us anytime during business hours.',
  },
];

const HOURS = [
  { day: 'Monday - Friday', value: '9:00 AM – 7:00 PM' },
  { day: 'Saturday', value: '10:00 AM – 5:00 PM' },
  { day: 'Sunday', value: 'Closed' },
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

const HelpSupportScreen = ({ navigation }: Props) => {
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

            <Text style={styles.headerLabel}>Support</Text>

            <View style={styles.backButtonPlaceholder} />
          </View>

          <Animated.View style={heroAnimatedStyle}>
            <View style={styles.heroIconWrap}>
              <View style={styles.heroIconCircle}>
                <Ionicons
                  name="help-buoy-outline"
                  size={36}
                  color={GOLD}
                />
              </View>
            </View>

            <Text style={styles.heroTitle}>Help & Support</Text>

            <Text style={styles.heroSubtitle}>
              We're always here to help you. Contact us anytime or browse
              our frequently asked questions.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Contact Us</Text>

          {CONTACTS.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInDown.delay(100 + index * 70)
                .springify()
                .damping(18)}
            >
              <PressableScale style={styles.contactCard}>
                <View style={styles.contactIconWrap}>
                  <Ionicons name={item.icon} size={24} color={DARK} />
                </View>

                <View style={styles.contactTextWrap}>
                  <Text style={styles.contactTitle}>{item.title}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                  <Text style={styles.contactDesc}>{item.desc}</Text>
                </View>

                <Feather
                  name="chevron-right"
                  size={18}
                  color="#C9C9C9"
                />
              </PressableScale>
            </Animated.View>
          ))}

          <Text style={styles.sectionTitle}>Live Chat</Text>

          <Animated.View
            entering={FadeInDown.delay(280).springify().damping(16)}
            style={styles.chatCard}
          >
            <View style={styles.chatIconCircle}>
              <Ionicons
                name="chatbubbles-outline"
                size={30}
                color={GOLD}
              />
            </View>

            <Text style={styles.chatTitle}>Chat With Our Team</Text>

            <Text style={styles.chatText}>
              Start a live conversation with one of our customer care
              representatives.
            </Text>

            <PressableScale style={styles.chatButton}>
              <Ionicons
                name="send-outline"
                size={16}
                color={GOLD}
                style={styles.chatButtonIcon}
              />
              <Text style={styles.chatButtonText}>Start Live Chat</Text>
            </PressableScale>
          </Animated.View>

          <Text style={styles.sectionTitle}>
            Frequently Asked Questions
          </Text>

          {FAQS.map((item, index) => (
            <Animated.View
              key={item.q}
              entering={FadeInDown.delay(340 + index * 50)
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
                <Text style={styles.question}>{item.q}</Text>
              </View>

              <Text style={styles.answer}>{item.a}</Text>
            </Animated.View>
          ))}

          <Text style={styles.sectionTitle}>Business Hours</Text>

          <Animated.View
            entering={FadeInDown.delay(760).springify().damping(16)}
            style={styles.hoursCard}
          >
            {HOURS.map((item, index) => (
              <View key={item.day}>
                <View style={styles.hoursItemRow}>
                  <View style={styles.hoursIconWrap}>
                    <Feather name="clock" size={16} color={GOLD} />
                  </View>

                  <View style={styles.hoursTextWrap}>
                    <Text style={styles.hoursRow}>{item.day}</Text>
                    <Text style={styles.hoursValue}>{item.value}</Text>
                  </View>
                </View>

                {index < HOURS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(840).springify().damping(16)}
            style={styles.feedbackCard}
          >
            <View style={styles.feedbackIconCircle}>
              <Ionicons name="star" size={28} color={GOLD} />
            </View>

            <Text style={styles.feedbackTitle}>
              Your Feedback Matters
            </Text>

            <Text style={styles.feedbackText}>
              Help us improve your shopping experience by sharing your
              feedback and suggestions.
            </Text>

            <PressableScale style={styles.feedbackButton}>
              <Ionicons
                name="paper-plane-outline"
                size={17}
                color="#fff"
                style={styles.feedbackButtonIcon}
              />
              <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            </PressableScale>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

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
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  headerRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
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
    marginBottom: 18,
  },

  heroIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
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
    marginBottom: 12,
  },

  heroSubtitle: {
    textAlign: 'center',
    color: GRAY_TEXT,
    fontSize: 15,
    lineHeight: 23,
    paddingHorizontal: 10,
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
    marginTop: 10,
  },

  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',

    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  contactTextWrap: {
    flex: 1,
  },

  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
    marginBottom: 4,
  },

  contactValue: {
    fontSize: 14,
    color: GOLD,
    fontWeight: '700',
    marginBottom: 3,
  },

  contactDesc: {
    fontSize: 12,
    color: '#8A8A8A',
  },

  chatCard: {
    backgroundColor: '#faf8f3',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#f0df9c',
  },

  chatIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  chatTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: DARK,
    marginBottom: 10,
  },

  chatText: {
    textAlign: 'center',
    color: GRAY_TEXT,
    lineHeight: 23,
    fontSize: 15,
    marginBottom: 20,
  },

  chatButton: {
    backgroundColor: DARK,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  chatButtonIcon: {
    marginRight: 8,
  },

  chatButtonText: {
    color: GOLD,
    fontWeight: '700',
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

  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
  },

  answer: {
    color: GRAY_TEXT,
    fontSize: 14,
    lineHeight: 23,
    marginLeft: 26,
  },

  hoursCard: {
    backgroundColor: '#faf8f3',
    borderRadius: 22,
    padding: 22,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#f0df9c',
  },

  hoursItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  hoursIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  hoursTextWrap: {
    flex: 1,
  },

  hoursRow: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK,
    marginBottom: 3,
  },

  hoursValue: {
    color: '#8A8A8A',
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 14,
  },

  feedbackCard: {
    backgroundColor: '#faf8f3',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#f0df9c',
  },

  feedbackIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  feedbackTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: DARK,
    marginBottom: 12,
    textAlign: 'center',
  },

  feedbackText: {
    color: GRAY_TEXT,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 22,
  },

  feedbackButton: {
    backgroundColor: GOLD,
    paddingHorizontal: 34,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  feedbackButtonIcon: {
    marginRight: 8,
  },

  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});