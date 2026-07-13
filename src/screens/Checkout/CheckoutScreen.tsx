import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withSpring, withSequence,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

const STEPS = ['Address', 'Payment', 'Review'];

const ORDER_ITEMS = [
  { id: '1', name: 'Zari Embroidered Suit', price: 8500,  qty: 1, emoji: '👗' },
  { id: '2', name: 'Silk Dupatta',          price: 2200,  qty: 2, emoji: '🧤' },
];

const PAYMENT_METHODS = [
  { id: 'cod',    label: 'Cash on Delivery', icon: '💵', sub: 'Pay when you receive'       },
  { id: 'card',   label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, UBL'  },
  { id: 'jazz',   label: 'JazzCash',         icon: '📱', sub: 'Mobile wallet payment'      },
  { id: 'easyp',  label: 'EasyPaisa',        icon: '🟢', sub: 'Mobile wallet payment'      },
];

// Step indicator
const StepIndicator = ({ current }: { current: number }) => (
  <View style={styles.stepRow}>
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <View style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            i < current && styles.stepDone,
            i === current && styles.stepActive,
          ]}>
            {i < current
              ? <Text style={styles.stepCheckmark}>✓</Text>
              : <Text style={[styles.stepNumber, i === current && { color: '#fff' }]}>{i + 1}</Text>
            }
          </View>
          <Text style={[styles.stepLabel, i === current && styles.stepLabelActive]}>{step}</Text>
        </View>
        {i < STEPS.length - 1 && (
          <View style={[styles.stepLine, i < current && styles.stepLineDone]} />
        )}
      </React.Fragment>
    ))}
  </View>
);

// Section wrapper with animation
const AnimSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
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

// ── Step 1: Address ──────────────────────────────────────
const AddressStep = ({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) => (
  <AnimSection delay={0}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📍 Delivery Address</Text>

      <Text style={styles.fieldLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Raza Ahmed"
        placeholderTextColor="#bbb"
        value={data.name}
        onChangeText={v => onChange('name', v)}
      />

      <Text style={styles.fieldLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 0300-1234567"
        placeholderTextColor="#bbb"
        keyboardType="phone-pad"
        value={data.phone}
        onChangeText={v => onChange('phone', v)}
      />

      <Text style={styles.fieldLabel}>Street Address</Text>
      <TextInput
        style={styles.input}
        placeholder="House #, Street, Area"
        placeholderTextColor="#bbb"
        value={data.street}
        onChangeText={v => onChange('street', v)}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Karachi"
            placeholderTextColor="#bbb"
            value={data.city}
            onChangeText={v => onChange('city', v)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Postal Code</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 75500"
            placeholderTextColor="#bbb"
            keyboardType="numeric"
            value={data.postal}
            onChangeText={v => onChange('postal', v)}
          />
        </View>
      </View>

      <Text style={styles.fieldLabel}>Province</Text>
      <View style={styles.provinceRow}>
        {['Sindh', 'Punjab', 'KPK', 'Balochistan'].map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.provinceChip, data.province === p && styles.provinceChipActive]}
            onPress={() => onChange('province', p)}
          >
            <Text style={[styles.provinceText, data.province === p && styles.provinceTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </AnimSection>
);

// ── Step 2: Payment ──────────────────────────────────────
const PaymentStep = ({
  selected, onSelect, cardData, onCardChange,
}: {
  selected: string;
  onSelect: (id: string) => void;
  cardData: any;
  onCardChange: (k: string, v: string) => void;
}) => (
  <AnimSection delay={0}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>💳 Payment Method</Text>
      {PAYMENT_METHODS.map(method => (
        <TouchableOpacity
          key={method.id}
          style={[styles.paymentOption, selected === method.id && styles.paymentOptionActive]}
          onPress={() => onSelect(method.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.paymentIcon}>{method.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.paymentLabel, selected === method.id && { color: DARK }]}>
              {method.label}
            </Text>
            <Text style={styles.paymentSub}>{method.sub}</Text>
          </View>
          <View style={[styles.radioOuter, selected === method.id && styles.radioOuterActive]}>
            {selected === method.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>

    {/* Card fields shown only when card is selected */}
    {selected === 'card' && (
      <AnimSection delay={100}>
        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.cardTitle}>🔒 Card Details</Text>
          <Text style={styles.fieldLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234  5678  9012  3456"
            placeholderTextColor="#bbb"
            keyboardType="numeric"
            maxLength={19}
            value={cardData.number}
            onChangeText={v => onCardChange('number', v)}
          />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.fieldLabel}>Expiry</Text>
              <TextInput
                style={styles.input}
                placeholder="MM / YY"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                maxLength={5}
                value={cardData.expiry}
                onChangeText={v => onCardChange('expiry', v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="•••"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                value={cardData.cvv}
                onChangeText={v => onCardChange('cvv', v)}
              />
            </View>
          </View>
          <Text style={styles.fieldLabel}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="As on card"
            placeholderTextColor="#bbb"
            value={cardData.holder}
            onChangeText={v => onCardChange('holder', v)}
          />
        </View>
      </AnimSection>
    )}
  </AnimSection>
);

// ── Step 3: Review ───────────────────────────────────────
const ReviewStep = ({ address, payment }: { address: any; payment: string }) => {
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const method = PAYMENT_METHODS.find(m => m.id === payment);

  return (
    <AnimSection delay={0}>
      {/* Delivery Address Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Delivery Address</Text>
        <Text style={styles.reviewText}>{address.name}</Text>
        <Text style={styles.reviewTextSub}>{address.street}</Text>
        <Text style={styles.reviewTextSub}>{address.city}, {address.province} {address.postal}</Text>
        <Text style={styles.reviewTextSub}>📞 {address.phone}</Text>
      </View>

      {/* Payment Summary */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>💳 Payment Method</Text>
        <Text style={styles.reviewText}>{method?.icon}  {method?.label}</Text>
      </View>

      {/* Order Items */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>🛍️ Order Items</Text>
        {ORDER_ITEMS.map(item => (
          <View key={item.id} style={styles.orderItemRow}>
            <Text style={styles.orderItemEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.orderItemQty}>Qty: {item.qty}</Text>
            </View>
            <Text style={styles.orderItemPrice}>
              PKR {(item.price * item.qty).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Price Breakdown */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>🧾 Price Breakdown</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal</Text>
          <Text style={styles.priceValue}>PKR {subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Shipping</Text>
          <Text style={[styles.priceValue, shipping === 0 && { color: '#2e7d32' }]}>
            {shipping === 0 ? 'FREE' : `PKR ${shipping}`}
          </Text>
        </View>
        {shipping === 0 && (
          <View style={styles.freeShippingBadge}>
            <Text style={styles.freeShippingText}>🎉 You qualify for free shipping!</Text>
          </View>
        )}
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text>
        </View>
      </View>
    </AnimSection>
  );
};

// ── Main Screen ──────────────────────────────────────────
const CheckoutScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: '', phone: '', street: '', city: '',
    postal: '', province: 'Sindh',
  });
  const [payment, setPayment] = useState('cod');
  const [cardData, setCardData] = useState({
    number: '', expiry: '', cvv: '', holder: '',
  });
  const [loading, setLoading] = useState(false);

  const btnScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(((step + 1) / STEPS.length) * 100, { duration: 400 });
  }, [step]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleAddressChange = (key: string, val: string) =>
    setAddress(prev => ({ ...prev, [key]: val }));

  const handleCardChange = (key: string, val: string) =>
    setCardData(prev => ({ ...prev, [key]: val }));

  const validateStep = () => {
    if (step === 0) {
      if (!address.name || !address.phone || !address.street || !address.city) return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    btnScale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withTiming(1, { duration: 120 }),
    );
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Place order
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.replace('OrderSuccess');
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigation.goBack();
  };

  const getButtonLabel = () => {
    if (loading) return 'PLACING ORDER...';
    if (step === 2) return 'PLACE ORDER';
    return 'CONTINUE';
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
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <AddressStep data={address} onChange={handleAddressChange} />
          )}
          {step === 1 && (
            <PaymentStep
              selected={payment}
              onSelect={setPayment}
              cardData={cardData}
              onCardChange={handleCardChange}
            />
          )}
          {step === 2 && (
            <ReviewStep address={address} payment={payment} />
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <Animated.View style={[{ flex: 1 }, btnStyle]}>
            <TouchableOpacity
              style={[styles.continueBtn, loading && { opacity: 0.7 }]}
              onPress={handleNext}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.continueBtnText}>{getButtonLabel()}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, color: DARK, fontWeight: '700' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: DARK },

  // Progress
  progressBg: { height: 4, backgroundColor: '#f0f0f0' },
  progressFill: { height: 4, backgroundColor: GOLD, borderRadius: 2 },

  // Steps
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  stepItem: { alignItems: 'center', gap: 6 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
  stepActive: { backgroundColor: DARK, borderColor: DARK },
  stepDone: { backgroundColor: GOLD, borderColor: GOLD },
  stepNumber: { fontSize: 13, fontWeight: '700', color: '#aaa' },
  stepCheckmark: { fontSize: 13, fontWeight: '800', color: '#fff' },
  stepLabel: { fontSize: 11, fontWeight: '600', color: '#aaa' },
  stepLabelActive: { color: DARK },
  stepLine: { flex: 1, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 6, marginBottom: 20 },
  stepLineDone: { backgroundColor: GOLD },

  // Scroll
  scrollContent: { padding: 16, paddingBottom: 120 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: DARK, marginBottom: 16 },

  // Fields
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#f8f8f8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: DARK, borderWidth: 1.5, borderColor: '#eee' },
  row: { flexDirection: 'row' },

  // Province
  provinceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  provinceChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1.5, borderColor: '#eee' },
  provinceChipActive: { backgroundColor: DARK, borderColor: DARK },
  provinceText: { fontSize: 12, fontWeight: '600', color: '#666' },
  provinceTextActive: { color: GOLD },

  // Payment
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#eee', marginBottom: 10, backgroundColor: '#fafafa' },
  paymentOptionActive: { borderColor: DARK, backgroundColor: '#faf8f3' },
  paymentIcon: { fontSize: 22, marginRight: 12 },
  paymentLabel: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 2 },
  paymentSub: { fontSize: 11, color: '#aaa' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: DARK },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD },

  // Review
  reviewText: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 4 },
  reviewTextSub: { fontSize: 13, color: '#666', marginBottom: 2 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  orderItemEmoji: { fontSize: 28, marginRight: 12 },
  orderItemName: { fontSize: 13, fontWeight: '600', color: DARK, marginBottom: 2 },
  orderItemQty: { fontSize: 11, color: '#888' },
  orderItemPrice: { fontSize: 13, fontWeight: '800', color: GOLD },

  // Price
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel: { fontSize: 14, color: '#666' },
  priceValue: { fontSize: 14, fontWeight: '600', color: DARK },
  freeShippingBadge: { backgroundColor: '#e8f5e9', borderRadius: 8, padding: 10, marginVertical: 6 },
  freeShippingText: { fontSize: 12, color: '#2e7d32', fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 4, paddingTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: DARK },
  totalValue: { fontSize: 16, fontWeight: '800', color: GOLD },

  // Bottom bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12, elevation: 12 },
  continueBtn: { backgroundColor: DARK, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  continueBtnText: { color: GOLD, fontWeight: '800', fontSize: 14, letterSpacing: 2 },
});

export default CheckoutScreen;