import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, TextInput, KeyboardAvoidingView,
  Platform, ScrollView, Modal,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withDelay, withSpring, withSequence, Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Addresses'>;

const GOLD = '#C9A227';
const DARK = '#0d0d0d';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    label: 'Home',
    name: 'Raza Ahmed',
    phone: '0300-1234567',
    street: 'House 12, Block B, Gulshan-e-Iqbal',
    city: 'Karachi',
    province: 'Sindh',
    postal: '75300',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    name: 'Raza Ahmed',
    phone: '0321-9876543',
    street: 'Plot 45, SMCHS, Shahrah-e-Faisal',
    city: 'Karachi',
    province: 'Sindh',
    postal: '74400',
    isDefault: false,
  },
];

const PROVINCES = ['Sindh', 'Punjab', 'KPK', 'Balochistan'];
const LABELS = ['Home', 'Office', 'Other'];

const EMPTY_FORM: Omit<Address, 'id' | 'isDefault'> = {
  label: 'Home', name: '', phone: '',
  street: '', city: '', province: 'Sindh', postal: '',
};

const AddressCard = ({
  address,
  index,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.addressCard, address.isDefault && styles.addressCardDefault, style]}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.labelRow}>
          <View style={styles.labelBadge}>
            <Text style={styles.labelIcon}>
              {address.label === 'Home' ? '🏠' : address.label === 'Office' ? '🏢' : '📍'}
            </Text>
            <Text style={styles.labelText}>{address.label}</Text>
          </View>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>✓ Default</Text>
            </View>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
          {!address.isDefault && (
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Text style={styles.deleteBtnText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Address info */}
      <Text style={styles.addressName}>{address.name}</Text>
      <Text style={styles.addressLine}>{address.street}</Text>
      <Text style={styles.addressLine}>
        {address.city}, {address.province} {address.postal}
      </Text>
      <Text style={styles.addressPhone}>📞 {address.phone}</Text>

      {/* Set as default */}
      {!address.isDefault && (
        <TouchableOpacity style={styles.setDefaultBtn} onPress={onSetDefault}>
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// Address form modal
const AddressFormModal = ({
  visible,
  initial,
  onSave,
  onClose,
}: {
  visible: boolean;
  initial: Omit<Address, 'id' | 'isDefault'>;
  onSave: (data: Omit<Address, 'id' | 'isDefault'>) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const translateY = useSharedValue(400);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  useEffect(() => {
    translateY.value = visible
      ? withSpring(0, { damping: 18, stiffness: 120 })
      : withTiming(400, { duration: 300 });
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const update = (key: keyof typeof form, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.modalBg} onPress={onClose} />
        <Animated.View style={[styles.modalSheet, sheetStyle]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initial.name ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Label picker */}
            <Text style={styles.formLabel}>Label</Text>
            <View style={styles.labelsRow}>
              {LABELS.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.labelChip, form.label === l && styles.labelChipActive]}
                  onPress={() => update('label', l)}
                >
                  <Text style={[styles.labelChipText, form.label === l && styles.labelChipTextActive]}>
                    {l === 'Home' ? '🏠 ' : l === 'Office' ? '🏢 ' : '📍 '}{l}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {[
              { label: 'Full Name',      key: 'name',   placeholder: 'e.g. Raza Ahmed',           keyboard: 'default'       },
              { label: 'Phone Number',   key: 'phone',  placeholder: 'e.g. 0300-1234567',         keyboard: 'phone-pad'     },
              { label: 'Street Address', key: 'street', placeholder: 'House #, Street, Area',      keyboard: 'default'       },
              { label: 'City',           key: 'city',   placeholder: 'e.g. Karachi',              keyboard: 'default'       },
              { label: 'Postal Code',    key: 'postal', placeholder: 'e.g. 75300',                keyboard: 'numeric'       },
            ].map(field => (
              <View key={field.key}>
                <Text style={styles.formLabel}>{field.label}</Text>
                <TextInput
                  style={styles.formInput}
                  value={form[field.key as keyof typeof form]}
                  onChangeText={v => update(field.key as keyof typeof form, v)}
                  placeholder={field.placeholder}
                  placeholderTextColor="#bbb"
                  keyboardType={field.keyboard as any}
                />
              </View>
            ))}

            {/* Province */}
            <Text style={styles.formLabel}>Province</Text>
            <View style={styles.provinceRow}>
              {PROVINCES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.provinceChip, form.province === p && styles.provinceChipActive]}
                  onPress={() => update('province', p)}
                >
                  <Text style={[styles.provinceText, form.province === p && styles.provinceTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => onSave(form)}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>SAVE ADDRESS</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Main Screen ───────────────────────────────────────────
const AddressesScreen = ({ navigation }: Props) => {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefault'>>(EMPTY_FORM);

  const headerOpacity = useSharedValue(0);
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
  }, []);
  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label, name: address.name,
      phone: address.phone, street: address.street,
      city: address.city, province: address.province,
      postal: address.postal,
    });
    setModalVisible(true);
  };

  const handleSave = (data: Omit<Address, 'id' | 'isDefault'>) => {
    if (editingId) {
      setAddresses(prev =>
        prev.map(a => a.id === editingId ? { ...a, ...data } : a),
      );
    } else {
      const newAddr: Address = {
        ...data,
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
      };
      setAddresses(prev => [...prev, newAddr]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === id })),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={openAdd}>
          <Text style={styles.addHeaderBtnText}>+ Add</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* List */}
      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📍</Text>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySub}>Add a delivery address to get started</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Text style={styles.emptyAddBtnText}>+ Add Address</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => (
          <AddressCard
            address={item}
            index={index}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item.id)}
            onSetDefault={() => handleSetDefault(item.id)}
          />
        )}
      />

      {/* FAB */}
      {addresses.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.85}>
          <Text style={styles.fabText}>+ New Address</Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <AddressFormModal
        visible={modalVisible}
        initial={formData}
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, fontWeight: '700', color: DARK },
  headerTitle: { fontSize: 17, fontWeight: '800', color: DARK },
  addHeaderBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: DARK },
  addHeaderBtnText: { fontSize: 12, fontWeight: '800', color: GOLD },
  listContent: { padding: 16, paddingBottom: 100 },
  addressCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 },
  addressCardDefault: { borderWidth: 1.5, borderColor: GOLD },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f5f5f5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  labelIcon: { fontSize: 13 },
  labelText: { fontSize: 12, fontWeight: '700', color: DARK },
  defaultBadge: { backgroundColor: '#faf3dc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#f0e8cc' },
  defaultText: { fontSize: 11, fontWeight: '700', color: GOLD },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  editBtnText: { fontSize: 14 },
  deleteBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#fff0f0', alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { fontSize: 14 },
  addressName: { fontSize: 14, fontWeight: '800', color: DARK, marginBottom: 4 },
  addressLine: { fontSize: 13, color: '#666', marginBottom: 2 },
  addressPhone: { fontSize: 13, color: '#888', marginTop: 6, marginBottom: 12 },
  setDefaultBtn: { borderWidth: 1.5, borderColor: GOLD, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  setDefaultText: { fontSize: 12, fontWeight: '700', color: GOLD },
  fab: { position: 'absolute', bottom: 24, left: 20, right: 20, backgroundColor: DARK, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: GOLD, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 6 },
  fabText: { color: GOLD, fontWeight: '800', fontSize: 14, letterSpacing: 1 },
  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#aaa', marginBottom: 24 },
  emptyAddBtn: { backgroundColor: DARK, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  emptyAddBtnText: { color: GOLD, fontWeight: '800', fontSize: 13 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBg: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0', alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: DARK },
  modalClose: { fontSize: 16, color: '#aaa', fontWeight: '700' },
  labelsRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  labelChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1.5, borderColor: '#eee' },
  labelChipActive: { backgroundColor: DARK, borderColor: DARK },
  labelChipText: { fontSize: 12, fontWeight: '700', color: '#666' },
  labelChipTextActive: { color: GOLD },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 7, marginTop: 14 },
  formInput: { borderWidth: 1.5, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: DARK, backgroundColor: '#fafafa' },
  provinceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  provinceChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 1.5, borderColor: '#eee' },
  provinceChipActive: { backgroundColor: DARK, borderColor: DARK },
  provinceText: { fontSize: 12, fontWeight: '600', color: '#666' },
  provinceTextActive: { color: GOLD },
  saveBtn: { backgroundColor: DARK, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 24, shadowColor: GOLD, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: GOLD, fontWeight: '800', fontSize: 14, letterSpacing: 2 },
});

export default AddressesScreen;