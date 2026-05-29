import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { useCategories } from '../../hooks/useCategories';

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { categories, loadCategories, createCategory, updateCategory } = useCategories();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      if (isNew) setName('');
    };
    init();
  }, []);

  useEffect(() => {
    if (!isNew && categories.length > 0) {
      const category = categories.find((category) => category.id === id);
      if (category) setName(category.name);
    }
  }, [categories]);

  const onSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const trimmedName = name.trim();
    try {
      if (isNew) await createCategory(trimmedName);
      else await updateCategory(id, trimmedName);
      router.replace('/(tabs)/categories');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {isNew ? 'Nueva categoría' : 'Editar categoría'}
          </Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Alimentación"
          />

          <TouchableOpacity style={styles.btn} onPress={onSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>{isNew ? 'Crear' : 'Guardar'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, color: '#444', marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: { color: 'red', fontSize: 12, marginTop: 4 },
  btn: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
