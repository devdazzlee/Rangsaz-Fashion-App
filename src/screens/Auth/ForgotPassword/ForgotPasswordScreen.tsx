import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, StatusBar, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withSpring, withSequence, Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

type Step = 'email' | 'otp' | 'reset' | 'success';

const OTP_LENGTH = 6;

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  // Animations
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(30);
  const btnScale = useSharedValue(1);
  const iconScale = useSharedValue(0);
  const progressWidth = useSharedValue(25);

  const stepIndex = { email: 0, otp: 1, reset: 2, success: 3 };

  useEffect(() => {
    animateIn();
  }, [step]);

  useEffect(() => {
    if (step === 'otp') startResendTimer();
    return () => clearInterval(timerRef.current);
  }, [step]);

  const animateIn = () => {
    contentOpacity.value = 0;
    contentY.value = 20;
    contentOpacity.value = withTiming(1, { duration: 400 });
    contentY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) });

    const pct = ((stepIndex[step] + 1) / 4) * 100;
    progressWidth.value = withTiming(pct, { duration: 500 });

    if (step === 'success') {
      iconScale.value = 0;
      iconScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 120 }));
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handleBtn = () => {
    setError('');
    btnScale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withTiming(1, { duration: 120 }),
    );

    if (step === 'email') {
      if (!email.trim() || !email.includes('@')) {
        setError('Enter a valid email address');
        return;
      }
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep('otp'); }, 1200);

    } else if (step === 'otp') {
      if (otp.some(d => d === '')) {
        setError('Please enter the complete 6-digit OTP');
        return;
      }
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep('reset'); }, 1000);

    } else if (step === 'reset') {
      if (!newPassword || newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep('success'); }, 1200);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const getStepLabel = () => {
    if (step === 'email') return loading ? 'SENDING OTP...' : 'SEND OTP';
    if (step === 'otp') return loading ? 'VERIFYING...' : 'VERIFY OTP';
    if (step === 'reset') return loading ? 'UPDATING...' : 'UPDATE PASSWORD';
    return '';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => step === 'email' ? navigation.goBack() : setStep(
              step === 'otp' ? 'email' : step === 'reset' ? 'otp' : 'email'
            )}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Email step ── */}
          {step === 'email' && (
            <Animated.View style={contentStyle}>
              <View style={styles.iconCircle}>
                <Text style={styles.stepEmoji}>📧</Text>
              </View>
              <Text style={styles.stepTitle}>Forgot Password?</Text>
              <Text style={styles.stepSubtitle}>
                Enter your registered email address and we'll send you a 6-digit OTP to reset your password.
              </Text>

              {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#bbb"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </Animated.View>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <Animated.View style={contentStyle}>
              <View style={styles.iconCircle}>
                <Text style={styles.stepEmoji}>🔐</Text>
              </View>
              <Text style={styles.stepTitle}>Enter OTP</Text>
              <Text style={styles.stepSubtitle}>
                We sent a 6-digit code to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

              {/* OTP boxes */}
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={r => { otpRefs.current[i] = r; }}
                    style={[styles.otpBox, digit && styles.otpBoxFilled]}
                    value={digit}
                    onChangeText={v => handleOtpChange(v.slice(-1), i)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Resend */}
              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn't receive the code? </Text>
                {canResend ? (
                  <TouchableOpacity onPress={() => { setOtp(['', '', '', '', '', '']); startResendTimer(); }}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
                )}
              </View>
            </Animated.View>
          )}

          {/* ── Reset step ── */}
          {step === 'reset' && (
            <Animated.View style={contentStyle}>
              <View style={styles.iconCircle}>
                <Text style={styles.stepEmoji}>🔒</Text>
              </View>
              <Text style={styles.stepTitle}>New Password</Text>
              <Text style={styles.stepSubtitle}>
                Create a strong password that you haven't used before.
              </Text>

              {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

              <Text style={styles.fieldLabel}>New Password</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#bbb"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Text style={styles.showHide}>{showNew ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              {newPassword.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBg}>
                    <View style={[styles.strengthFill, {
                      width: newPassword.length < 4 ? '25%' : newPassword.length < 6 ? '50%' : newPassword.length < 10 ? '75%' : '100%',
                      backgroundColor: newPassword.length < 4 ? '#d32f2f' : newPassword.length < 6 ? '#f57c00' : newPassword.length < 10 ? GOLD : '#2e7d32',
                    }]} />
                  </View>
                  <Text style={styles.strengthLabel}>
                    {newPassword.length < 4 ? 'Weak' : newPassword.length < 6 ? 'Fair' : newPassword.length < 10 ? 'Good' : 'Strong'}
                  </Text>
                </View>
              )}

              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="#bbb"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Text style={styles.showHide}>{showConfirm ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* ── Success step ── */}
          {step === 'success' && (
            <Animated.View style={[styles.successSection, contentStyle]}>
              <Animated.View style={[styles.successCircle, iconStyle]}>
                <Text style={styles.successIcon}>✓</Text>
              </Animated.View>
              <Text style={styles.successTitle}>Password Reset!</Text>
              <Text style={styles.successSubtitle}>
                Your password has been updated successfully. You can now login with your new password.
              </Text>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.replace('Login')}
                activeOpacity={0.85}
              >
                <Text style={styles.loginBtnText}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        {step !== 'success' && (
          <View style={styles.bottomBar}>
            <Animated.View style={[{ flex: 1 }, btnStyle]}>
              <TouchableOpacity
                style={[styles.continueBtn, loading && { opacity: 0.7 }]}
                onPress={handleBtn}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.continueBtnText}>{getStepLabel()}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, fontWeight: '700', color: DARK },
  headerTitle: { fontSize: 17, fontWeight: '800', color: DARK },
  progressBg: { height: 4, backgroundColor: '#f0f0f0' },
  progressFill: { height: 4, backgroundColor: GOLD, borderRadius: 2 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#faf3dc', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#f0e8cc' },
  stepEmoji: { fontSize: 36 },
  stepTitle: { fontSize: 24, fontWeight: '800', color: DARK, textAlign: 'center', marginBottom: 10 },
  stepSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  emailHighlight: { color: GOLD, fontWeight: '700' },
  errorBox: { backgroundColor: '#fdecea', borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#d32f2f' },
  errorText: { color: '#d32f2f', fontSize: 13 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 8, marginTop: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#fafafa', marginBottom: 4 },
  input: { flex: 1, fontSize: 14, color: DARK, paddingVertical: 14 },
  showHide: { fontSize: 12, color: GOLD, fontWeight: '700', paddingLeft: 8 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 24 },
  otpBox: { width: 46, height: 54, borderRadius: 12, borderWidth: 1.5, borderColor: '#eee', backgroundColor: '#fafafa', fontSize: 20, fontWeight: '800', color: DARK },
  otpBoxFilled: { borderColor: GOLD, backgroundColor: '#faf3dc' },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendLabel: { fontSize: 13, color: '#888' },
  resendLink: { fontSize: 13, fontWeight: '800', color: GOLD },
  resendTimer: { fontSize: 13, fontWeight: '700', color: '#aaa' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  strengthBg: { flex: 1, height: 5, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 3 },
  strengthLabel: { fontSize: 11, fontWeight: '700', color: '#888', width: 44 },
  successSection: { alignItems: 'center', paddingTop: 40 },
  successCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: DARK, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: GOLD, marginBottom: 24 },
  successIcon: { fontSize: 40, color: GOLD, fontWeight: '800' },
  successTitle: { fontSize: 26, fontWeight: '800', color: DARK, marginBottom: 12 },
  successSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  loginBtn: { width: '100%', backgroundColor: DARK, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  loginBtnText: { color: GOLD, fontWeight: '800', fontSize: 14, letterSpacing: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12, elevation: 12 },
  continueBtn: { backgroundColor: DARK, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  continueBtnText: { color: GOLD, fontWeight: '800', fontSize: 14, letterSpacing: 2 },
});

export default ForgotPasswordScreen;