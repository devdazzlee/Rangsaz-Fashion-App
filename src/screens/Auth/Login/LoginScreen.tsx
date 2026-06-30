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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation values
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

  const handleLogin = () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    buttonScale.value = withTiming(0.97, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 150 });
    });

    setLoading(true);
    // TODO: call authService.login(email, password)
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
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subText}>Sign in to continue shopping</Text>
          </LinearGradient>
        </Animated.View>

        {/* Form section */}
        <Animated.View style={[styles.formSection, formStyle]}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

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
              placeholder="••••••••"
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

          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Animated.View style={buttonStyle}>
            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'SIGNING IN...' : 'LOGIN'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.signupWrapper}
            onPress={() => navigation.replace('Signup')}
          >
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign Up</Text>
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
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: { width: 200, height: 80, marginBottom: 16 },
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
    paddingTop: 32,
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
    marginTop: 16,
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
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotText: {
    color: '#888',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: DARK,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: GOLD,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: {
    marginHorizontal: 12,
    color: '#aaa',
    fontSize: 12,
  },
  signupWrapper: { alignItems: 'center', paddingBottom: 40 },
  signupText: { fontSize: 13, color: '#555' },
  signupLink: { color: GOLD, fontWeight: '700' },
});

export default LoginScreen;