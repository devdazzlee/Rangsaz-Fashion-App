import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const GOLD = '#C9A227';
const GOLD_SOFT = '#F6EFD8';
const DARK = '#0d0d0d';
const GRAY_TEXT = '#6B6B6B';
const BORDER = '#EFEFEF';

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
        scale.value = withTiming(0.95, { duration: 100 });
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

// ── Animated section wrapper ──────────────────────────────
const AnimSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

// ── Section header with icon ──────────────────────────────
const CardTitle = ({
  icon,
  title,
  color = DARK,
}: {
  icon: string;
  title: string;
  color?: string;
}) => (
  <View style={styles.cardTitleRow}>
    <View style={[styles.cardTitleIconWrap, color !== DARK && { backgroundColor: '#fff2f2' }]}>
      <Ionicons name={icon} size={16} color={color} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

// ── Input Field ───────────────────────────────────────────
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  editable = true,
  rightElement,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: any;
  secureTextEntry?: boolean;
  editable?: boolean;
  rightElement?: React.ReactNode;
}) => {
  const [focused, setFocused] = useState(false);
  const borderColor = useSharedValue(0);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1 ? GOLD : '#e8e8e8',
    borderWidth: borderColor.value === 1 ? 1.8 : 1.5,
  }));

  const handleFocus = () => {
    setFocused(true);
    borderColor.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setFocused(false);
    borderColor.value = withTiming(0, { duration: 200 });
  };

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Animated.View
        style={[styles.inputBox, borderStyle, !editable && styles.inputBoxDisabled]}
      >
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#bbb"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {rightElement}
      </Animated.View>
    </View>
  );
};

// ── Main Screen ───────────────────────────────────────────
const EditProfileScreen = ({ navigation }: Props) => {
  // Personal info
  const [fullName, setFullName] = useState('Raza Ahmed');
  const [email, setEmail] = useState('raza.ahmed@example.com');
  const [phone, setPhone] = useState('0300-1234567');
  const [city, setCity] = useState('Karachi');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // UI state
  const [saveLoading, setSaveLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Animations
  const avatarScale = useSharedValue(0);
  const saveBtnScale = useSharedValue(1);
  const successOpacity = useSharedValue(0);
  const successY = useSharedValue(10);

  useEffect(() => {
    avatarScale.value = withDelay(0, withSpring(1, { damping: 12, stiffness: 100 }));
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const saveBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveBtnScale.value }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ translateY: successY.value }],
  }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Name is required';
    if (!phone.trim()) errs.phone = 'Phone is required';
    if (newPassword && newPassword.length < 6)
      errs.newPassword = 'Password must be at least 6 characters';
    if (newPassword && newPassword !== confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    if (newPassword && !currentPassword)
      errs.currentPassword = 'Enter your current password';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    saveBtnScale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withTiming(1, { duration: 120 }),
    );

    setSaveLoading(true);
    // TODO: call userService.updateProfile(...)
    setTimeout(() => {
      setSaveLoading(false);
      setShowSuccess(true);
      successOpacity.value = withTiming(1, { duration: 400 });
      successY.value = withTiming(0, { duration: 400 });
      setTimeout(() => {
        successOpacity.value = withTiming(0, { duration: 400 });
        setShowSuccess(false);
      }, 2500);
    }, 1200);
  };

  const avatarInitials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={19} color={DARK} />
          </PressableScale>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.headerSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar section */}
          <AnimSection delay={0}>
            <View style={styles.avatarSection}>
              <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarInitials}</Text>
                </View>
                <PressableScale style={styles.cameraBtn}>
                  <Ionicons name="camera" size={14} color={DARK} />
                </PressableScale>
              </Animated.View>
              <Text style={styles.avatarName}>{fullName}</Text>
              <View style={styles.avatarSubRow}>
                <Ionicons name="sparkles" size={12} color={GOLD} style={styles.avatarSubIcon} />
                <Text style={styles.avatarSub}>Gold Member</Text>
              </View>
            </View>
          </AnimSection>

          {/* Personal Info */}
          <AnimSection delay={100}>
            <View style={styles.card}>
              <CardTitle icon="person-outline" title="Personal Information" />

              <InputField
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}

              <InputField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                editable={false}
              />
              <View style={styles.hintRow}>
                <Feather name="info" size={11} color="#aaa" style={styles.hintIcon} />
                <Text style={styles.hintText}>Email cannot be changed</Text>
              </View>

              <InputField
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="0300-1234567"
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <InputField
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Karachi"
              />

              {/* Gender selector */}
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {(['Male', 'Female', 'Other'] as const).map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderChip, gender === g && styles.genderChipActive]}
                    onPress={() => setGender(g)}
                  >
                    <Ionicons
                      name={
                        g === 'Male'
                          ? 'man-outline'
                          : g === 'Female'
                          ? 'woman-outline'
                          : 'person-outline'
                      }
                      size={14}
                      color={gender === g ? GOLD : '#888'}
                      style={styles.genderIcon}
                    />
                    <Text
                      style={[styles.genderText, gender === g && styles.genderTextActive]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </AnimSection>

          {/* Change Password */}
          <AnimSection delay={200}>
            <View style={[styles.card, { marginTop: 14 }]}>
              <CardTitle icon="lock-closed-outline" title="Change Password" />
              <Text style={styles.cardSubtitle}>
                Leave blank to keep your current password
              </Text>

              <InputField
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry={!showCurrent}
                rightElement={
                  <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                    <Text style={styles.showHide}>{showCurrent ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                }
              />
              {errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}

              <InputField
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Min. 6 characters"
                secureTextEntry={!showNew}
                rightElement={
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    <Text style={styles.showHide}>{showNew ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                }
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              {/* Password strength bar */}
              {newPassword.length > 0 && (
                <View style={styles.strengthWrapper}>
                  <View style={styles.strengthBarBg}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        {
                          width:
                            newPassword.length < 4
                              ? '25%'
                              : newPassword.length < 6
                              ? '50%'
                              : newPassword.length < 10
                              ? '75%'
                              : '100%',
                          backgroundColor:
                            newPassword.length < 4
                              ? '#d32f2f'
                              : newPassword.length < 6
                              ? '#f57c00'
                              : newPassword.length < 10
                              ? GOLD
                              : '#2e7d32',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.strengthLabel}>
                    {newPassword.length < 4
                      ? 'Weak'
                      : newPassword.length < 6
                      ? 'Fair'
                      : newPassword.length < 10
                      ? 'Good'
                      : 'Strong'}
                  </Text>
                </View>
              )}

              <InputField
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                secureTextEntry={!showConfirm}
                rightElement={
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Text style={styles.showHide}>{showConfirm ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                }
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </AnimSection>

          {/* Notification Preferences */}
          <AnimSection delay={300}>
            <View style={[styles.card, { marginTop: 14 }]}>
              <CardTitle icon="notifications-outline" title="Notification Preferences" />

              {[
                {
                  label: 'Email Notifications',
                  sub: 'Order updates via email',
                  value: emailNotifs,
                  onChange: setEmailNotifs,
                },
                {
                  label: 'SMS Notifications',
                  sub: 'Order updates via SMS',
                  value: smsNotifs,
                  onChange: setSmsNotifs,
                },
                {
                  label: 'Newsletter',
                  sub: 'New arrivals & exclusive offers',
                  value: newsletter,
                  onChange: setNewsletter,
                },
              ].map((pref, i) => (
                <View
                  key={pref.label}
                  style={[styles.prefRow, i === 2 && { borderBottomWidth: 0 }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prefLabel}>{pref.label}</Text>
                    <Text style={styles.prefSub}>{pref.sub}</Text>
                  </View>
                  <Switch
                    value={pref.value}
                    onValueChange={pref.onChange}
                    trackColor={{ false: '#e0e0e0', true: GOLD }}
                    thumbColor={pref.value ? DARK : '#f4f3f4'}
                    ios_backgroundColor="#e0e0e0"
                  />
                </View>
              ))}
            </View>
          </AnimSection>

          {/* Danger zone */}
          <AnimSection delay={400}>
            <View style={[styles.card, { marginTop: 14 }]}>
              <CardTitle icon="warning-outline" title="Account" color="#d32f2f" />
              <PressableScale style={styles.dangerBtn}>
                <Feather name="trash-2" size={15} color="#d32f2f" style={styles.dangerIcon} />
                <Text style={styles.dangerBtnText}>Delete Account</Text>
              </PressableScale>
            </View>
          </AnimSection>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Save button */}
        <View style={styles.bottomBar}>
          <Animated.View style={[{ flex: 1 }, saveBtnStyle]}>
            <TouchableOpacity
              style={[styles.saveBtn, saveLoading && { opacity: 0.7 }]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={saveLoading}
            >
              <Text style={styles.saveBtnText}>
                {saveLoading ? 'SAVING...' : 'SAVE CHANGES'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Success toast */}
        {showSuccess && (
          <Animated.View style={[styles.toast, successStyle]}>
            <Ionicons
              name="checkmark-circle"
              size={17}
              color={GOLD}
              style={styles.toastIcon}
            />
            <Text style={styles.toastText}>Profile updated successfully!</Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: DARK },
  headerSave: { fontSize: 14, fontWeight: '800', color: GOLD },

  // Scroll
  scrollContent: { paddingHorizontal: 16, paddingTop: 22 },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: 26 },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: GOLD,
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: GOLD },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarName: { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 6 },
  avatarSubRow: { flexDirection: 'row', alignItems: 'center' },
  avatarSubIcon: { marginRight: 5 },
  avatarSub: { fontSize: 12, color: GOLD, fontWeight: '600' },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardTitleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: GOLD_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: DARK },
  cardSubtitle: { fontSize: 12, color: '#aaa', marginBottom: 8, marginLeft: 42 },

  // Fields
  fieldWrapper: { marginTop: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 7, marginTop: 4 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    backgroundColor: '#fafafa',
  },
  inputBoxDisabled: { backgroundColor: '#f3f3f3' },
  input: { flex: 1, fontSize: 14, color: DARK, paddingVertical: 12 },
  inputDisabled: { color: '#aaa' },
  showHide: { fontSize: 12, color: GOLD, fontWeight: '700', paddingLeft: 8 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  hintIcon: { marginRight: 5 },
  hintText: { fontSize: 11, color: '#aaa' },
  errorText: { fontSize: 11, color: '#d32f2f', marginTop: 4, fontWeight: '600' },

  // Gender
  genderRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  genderChipActive: { backgroundColor: DARK, borderColor: DARK },
  genderIcon: { marginRight: 6 },
  genderText: { fontSize: 13, fontWeight: '600', color: '#666' },
  genderTextActive: { color: GOLD },

  // Password strength
  strengthWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  strengthBarBg: { flex: 1, height: 5, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  strengthBarFill: { height: '100%', borderRadius: 3 },
  strengthLabel: { fontSize: 11, fontWeight: '700', color: '#888', width: 44 },

  // Preferences
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  prefLabel: { fontSize: 14, fontWeight: '600', color: DARK, marginBottom: 2 },
  prefSub: { fontSize: 11, color: '#aaa' },

  // Danger
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffcdd2',
    borderRadius: 14,
    paddingVertical: 15,
    backgroundColor: '#fff8f8',
  },
  dangerIcon: { marginRight: 8 },
  dangerBtnText: { fontSize: 14, fontWeight: '700', color: '#d32f2f' },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 12,
  },
  saveBtn: {
    backgroundColor: DARK,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',

    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: GOLD, fontWeight: '800', fontSize: 14, letterSpacing: 2 },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: DARK,
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  toastIcon: { marginRight: 8 },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});

export default EditProfileScreen;