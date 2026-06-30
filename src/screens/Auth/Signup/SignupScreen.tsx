import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const SignupScreen = ({ navigation }: Props) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const topOpacity = useSharedValue(0);
  const topY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formY = useSharedValue(30);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    topOpacity.value = withTiming(1, { duration: 600 });
    topY.value = withTiming(0, { duration: 600 });
    formOpacity.value = withDelay(200, withTiming(1, { duration: 700 }));
    formY.value = withDelay(200, withTiming(0, { duration: 700 }));
  }, []);

  const topStyle = useAnimatedStyle(() => ({
    opacity: topOpacity.value,
    transform: [{ translateY: topY.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignup = () => {
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    buttonScale.value = withTiming(0.97, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 150 });
    });

    setLoading(true);
    // TODO: call authService.signup(fullName, email, password)
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top brand section */}
        <Animated.View style={topStyle}>
          <LinearGradient
            colors={['#ffffff', '#faf8f3']}
            style={styles.topSection}
          >
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subText}>Join us and start shopping</Text>
          </LinearGradient>
        </Animated.View>

        {/* Form section */}
        <Animated.View style={[styles.formSection, formStyle]}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#999"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggleText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.toggleText}>
                {showConfirmPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={[styles.signupButton, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>
                {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.loginWrapper}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },
  topSection: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: { width: 180, height: 70, marginBottom: 14 },
  welcomeText: {
    color: '#111',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subText: {
    color: '#666',
    fontSize: 13,
    marginTop: 6,
  },
  formSection: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  errorBox: {
    backgroundColor: '#fdecea',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: 4,
  },
  toggleText: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    marginTop: 18,
    lineHeight: 18,
  },
  termsLink: {
    color: GOLD,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: DARK,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    color: GOLD,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: {
    marginHorizontal: 12,
    color: '#aaa',
    fontSize: 12,
  },
  loginWrapper: { alignItems: 'center', paddingBottom: 40 },
  loginText: { fontSize: 13, color: '#555' },
  loginLink: { color: GOLD, fontWeight: '700' },
});

export default SignupScreen;