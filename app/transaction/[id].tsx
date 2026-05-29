import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { useCategories } from '../../hooks/useCategories';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useLocation } from '../../hooks/useLocation';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import { useTransactions } from '../../hooks/useTransactions';

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { transactions, loadTransactions, createTransaction, updateTransaction, getById } =
    useTransactions();
  const { categories, loadCategories } = useCategories();
  const { values, errors, submitting, setField, handleSubmit } = useTransactionForm();

  const { imageUri, setImageUri, error: imageError, pickFromGallery, takePhoto, clearImage } =
  useImagePicker();

  const { location, setLocation, loading: locationLoading, error: locationError, getCurrentLocation, clearLocation } =
  useLocation();

  useEffect(() => {
    const init = async () => {
      await loadTransactions();
      await loadCategories();
    };
    init();
  }, []);

  useEffect(() => {
    if (!isNew && transactions.length > 0) {
      const t = getById(id);
      if (t) {
        setField('amount', t.amount.toString());
        setField('type', t.type);
        setField('description', t.description);
        setField('categoryId', t.categoryId);
        if (t.photoUri) setImageUri(t.photoUri);
      if (t.location) setLocation(t.location);
      }
    }
  }, [transactions]);

  const onSubmit = async () => {
    await handleSubmit(async (data) => {
      if (isNew) {
        await createTransaction({
          ...data,
          photoUri: imageUri ?? undefined,
          location: location ?? undefined,
        });
      } else {
        await updateTransaction(id, {
          ...data,
          photoUri: imageUri ?? undefined,
          location: location ?? undefined,
        });
      }
      router.back();
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            {isNew ? 'Nueva transacción' : 'Editar transacción'}
          </Text>

          {/* Descripción */}
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            value={values.description}
            onChangeText={(v) => setField('description', v)}
            placeholder="Ej: Supermercado"
          />
          {errors.description && <Text style={styles.error}>{errors.description}</Text>}

          {/* Monto */}
          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.input}
            value={values.amount}
            onChangeText={(v) => setField('amount', v)}
            keyboardType="numeric"
            placeholder="0"
          />
          {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

          {/* Tipo */}
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeRow}>
            {(['income', 'expense'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, values.type === t && styles.typeBtnActive]}
                onPress={() => setField('type', t)}
              >
                <Text style={[styles.typeBtnText, values.type === t && styles.typeBtnTextActive]}>
                  {t === 'income' ? 'Ingreso' : 'Egreso'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categoría */}
          <Text style={styles.label}>Categoría</Text>
          {categories.length === 0 && (
            <Text style={styles.error}>No hay categorías. Crea una primero.</Text>
          )}
          <View style={styles.catGrid}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.catBtn, values.categoryId === c.id && styles.catBtnActive]}
                onPress={() => setField('categoryId', c.id)}
              >
                <Text style={[styles.catBtnText, values.categoryId === c.id && styles.catBtnTextActive]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.categoryId && <Text style={styles.error}>{errors.categoryId}</Text>}

          {/* ── FOTO DEL COMPROBANTE ── */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>📷 Foto del comprobante</Text>
          <Text style={styles.hint}>Opcional</Text>

          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Text style={styles.photoBtnText}>📸 Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
              <Text style={styles.photoBtnText}>🖼 Galería</Text>
            </TouchableOpacity>
          </View>

          {imageUri && (
            <View style={styles.previewBox}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <TouchableOpacity onPress={clearImage}>
                <Text style={styles.removeText}>Quitar foto</Text>
              </TouchableOpacity>
            </View>
          )}

          {imageError && (
            <Text style={styles.permError}>{imageError}</Text>
          )}

          {/* ── UBICACIÓN GPS ── */}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>📍 Ubicación</Text>
          <Text style={styles.hint}>Opcional</Text>

          <TouchableOpacity style={styles.locationBtn} onPress={getCurrentLocation}>
            {locationLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.locationBtnText}>Obtener ubicación actual</Text>
            }
          </TouchableOpacity>

          {location && (
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>Lat: {location.latitude.toFixed(6)}</Text>
              <Text style={styles.locationText}>Lon: {location.longitude.toFixed(6)}</Text>
              <TouchableOpacity onPress={clearLocation}>
                <Text style={styles.removeText}>Quitar ubicación</Text>
              </TouchableOpacity>
            </View>
          )}

          {locationError && (
            <Text style={styles.permError}>{locationError}</Text>
          )}

          {/* ── GUARDAR ── */}
          <TouchableOpacity style={styles.btn} onPress={onSubmit} disabled={submitting}>
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>{isNew ? 'Crear' : 'Guardar'}</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, color: '#444', marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 12, fontSize: 16,
  },
  error: { color: 'red', fontSize: 12, marginTop: 4 },

  typeRow: { flexDirection: 'row', gap: 12 },
  typeBtn: {
    flex: 1, padding: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#ccc', alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  typeBtnText: { fontSize: 14 },
  typeBtnTextActive: { color: '#fff', fontWeight: '600' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 1, borderColor: '#ccc',
  },
  catBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  catBtnText: { fontSize: 13 },
  catBtnTextActive: { color: '#fff' },

  divider: { borderTopWidth: 1, borderColor: '#eee', marginTop: 28, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  hint: { fontSize: 12, color: '#999', marginBottom: 12 },

  photoRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  photoBtn: {
    flex: 1, backgroundColor: '#007AFF',
    padding: 12, borderRadius: 8, alignItems: 'center',
  },
  photoBtnText: { color: '#fff', fontWeight: '600' },
  previewBox: { marginBottom: 8 },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 6 },
  removeText: { color: '#FF3B30', fontSize: 13, textAlign: 'center', paddingVertical: 4 },
  permError: {
    color: '#FF3B30', fontSize: 13,
    backgroundColor: '#FFF0EE', padding: 10,
    borderRadius: 6, marginTop: 4,
  },

  locationBtn: {
    backgroundColor: '#34C759', padding: 12,
    borderRadius: 8, alignItems: 'center', marginBottom: 8,
  },
  locationBtnText: { color: '#fff', fontWeight: '600' },
  locationBox: {
    backgroundColor: '#F0FFF4', borderRadius: 8,
    padding: 12, marginBottom: 8, gap: 4,
  },
  locationText: { fontSize: 13, color: '#2D6A4F' },

  btn: {
    marginTop: 32, backgroundColor: '#007AFF',
    padding: 16, borderRadius: 10, alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});