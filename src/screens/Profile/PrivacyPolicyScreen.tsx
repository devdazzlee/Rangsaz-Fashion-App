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
  FadeIn,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PrivacyPolicy'
>;

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

type IconSet = 'ionicon' | 'material';

const SECTIONS: {
  iconSet: IconSet;
  icon: string;
  title: string;
  body: string;
}[] = [
  {
    iconSet: 'ionicon',
    icon: 'document-text-outline',
    title: 'Introduction',
    body:
      'At Rangsaz Fashion, your privacy is one of our highest priorities. This Privacy Policy explains how we collect, use, store, and protect your personal information whenever you use our application or website.',
  },
  {
    iconSet: 'ionicon',
    icon: 'person-outline',
    title: 'Information We Collect',
    body:
      'We may collect your name, email address, phone number, delivery address, profile information, and purchase history whenever you create an account or place an order.',
  },
  {
    iconSet: 'ionicon',
    icon: 'card-outline',
    title: 'Payment Information',
    body:
      'Payments are processed securely through trusted payment gateways. We never store your complete debit or credit card information on our servers.',
  },
  {
    iconSet: 'ionicon',
    icon: 'location-outline',
    title: 'Location Data',
    body:
      'If you allow location access, we use it only to improve delivery estimates and provide a better shopping experience.',
  },
  {
    iconSet: 'material',
    icon: 'cookie-outline',
    title: 'Cookies',
    body:
      'Cookies help us remember your preferences, keep you logged in, personalize recommendations, and improve app performance.',
  },
  {
    iconSet: 'ionicon',
    icon: 'lock-closed-outline',
    title: 'Data Security',
    body:
      'We use modern encryption technologies, secure servers, and strict access controls to safeguard your personal information from unauthorized access.',
  },
  {
    iconSet: 'ionicon',
    icon: 'cube-outline',
    title: 'Order Processing',
    body:
      'Your information is used to process orders, deliver products, send order updates, and provide customer support.',
  },
  {
    iconSet: 'ionicon',
    icon: 'people-outline',
    title: 'Third-Party Services',
    body:
      'We only share necessary information with trusted logistics companies, payment providers, and legal authorities when required.',
  },
  {
    iconSet: 'material',
    icon: 'scale-balance',
    title: 'Your Rights',
    body:
      'You can update your profile, request deletion of your account, or contact us to review the information we store about you.',
  },
  {
    iconSet: 'ionicon',
    icon: 'call-outline',
    title: 'Contact Us',
    body:
      'If you have questions regarding this Privacy Policy, please contact our support team at support@rangsazfashion.com.',
  },
];

const SectionIcon = ({
  iconSet,
  icon,
  size = 22,
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

const PrivacyPolicyScreen = ({ navigation }: Props) => {
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

            <Text style={styles.headerLabel}>Legal</Text>

            <View style={styles.backButtonPlaceholder} />
          </View>

          <Animated.View style={heroAnimatedStyle}>
            <View style={styles.heroIconWrap}>
              <View style={styles.heroIconCircle}>
                <Ionicons name="shield-checkmark" size={40} color={GOLD} />
              </View>
            </View>

            <Text style={styles.heroTitle}>Privacy Policy</Text>

            <Text style={styles.heroSubtitle}>
              Your privacy matters. We are committed to protecting your
              personal information and maintaining your trust.
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.delay(100).springify().damping(16)}
            style={styles.highlightCard}
          >
            <View style={styles.highlightTopRow}>
              <View style={styles.highlightBadge}>
                <Feather name="clock" size={14} color={GOLD} />
                <Text style={styles.highlightTitle}>Last Updated</Text>
              </View>
            </View>

            <Text style={styles.highlightDate}>July 2026</Text>

            <Text style={styles.highlightText}>
              Please review this Privacy Policy carefully to understand how
              we collect, use, and protect your personal information.
            </Text>
          </Animated.View>

          <Text style={styles.sectionLabel}>Details</Text>

          {SECTIONS.map((section, index) => (
            <Animated.View
              key={section.title}
              entering={FadeInDown.delay(150 + index * 60)
                .springify()
                .damping(18)}
              style={styles.policyCard}
            >
              <View style={styles.policyHeaderRow}>
                <View style={styles.policyIconWrap}>
                  <SectionIcon
                    iconSet={section.iconSet}
                    icon={section.icon}
                    size={20}
                    color={DARK}
                  />
                </View>

                <Text style={styles.policyTitle}>{section.title}</Text>
              </View>

              <Text style={styles.policyBody}>{section.body}</Text>
            </Animated.View>
          ))}

          <Animated.View
            entering={FadeIn.delay(150 + SECTIONS.length * 60 + 100)}
            style={styles.noticeCard}
          >
            <View style={styles.noticeIconCircle}>
              <Ionicons name="lock-closed" size={26} color={GOLD} />
            </View>

            <Text style={styles.noticeTitle}>Your Information Is Safe</Text>

            <Text style={styles.noticeBody}>
              We continuously improve our security practices and regularly
              update our systems to ensure your personal information remains
              protected.
            </Text>
          </Animated.View>

          <PressableScale style={styles.contactButton}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={GOLD}
              style={styles.contactButtonIcon}
            />
            <Text style={styles.contactButtonText}>
              Contact Privacy Team
            </Text>
          </PressableScale>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

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
    fontSize: 30,
    fontWeight: '800',
    color: DARK,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
  },

  heroSubtitle: {
    textAlign: 'center',
    color: GRAY_TEXT,
    fontSize: 15,
    lineHeight: 23,
    paddingHorizontal: 16,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  highlightCard: {
    backgroundColor: '#faf8f3',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#efe1a9',
    marginBottom: 30,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  highlightTopRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFE1A9',
  },

  highlightTitle: {
    fontSize: 12,
    color: '#8A7A3F',
    marginLeft: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  highlightDate: {
    fontSize: 24,
    color: GOLD,
    fontWeight: '800',
    marginBottom: 12,
  },

  highlightText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 23,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
    marginLeft: 4,
  },

  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  policyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  policyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  policyTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
    letterSpacing: 0.1,
  },

  policyBody: {
    fontSize: 15,
    color: GRAY_TEXT,
    lineHeight: 24,
  },

  noticeCard: {
    backgroundColor: '#faf8f3',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 30,

    borderWidth: 1,
    borderColor: '#f0df9c',
  },

  noticeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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

  noticeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: DARK,
    marginBottom: 10,
    textAlign: 'center',
  },

  noticeBody: {
    fontSize: 15,
    color: GRAY_TEXT,
    lineHeight: 24,
    textAlign: 'center',
  },

  contactButton: {
    backgroundColor: DARK,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  contactButtonIcon: {
    marginRight: 10,
  },

  contactButtonText: {
    color: GOLD,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});