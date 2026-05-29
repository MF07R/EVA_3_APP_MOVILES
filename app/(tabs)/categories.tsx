import type { Href } from 'expo-router';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types';

export default function CategoriesScreen() {
  const router = useRouter();
  const { categories, loadCategories, deleteCategory } = useCategories();

  useFocusEffect(
    useCallback(() => { loadCategories(); }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteCategory(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.push(`/category/${item.id}` as Href)}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={c => c.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay categorías</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/category/new' as Href)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderColor: '#eee',
  },
  name: { fontSize: 16 },
  row: { flexDirection: 'row', gap: 16 },
  edit: { color: '#007AFF', fontSize: 14 },
  delete: { color: 'red', fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 60, color: '#888' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#007AFF', width: 50, height: 50,
    borderRadius: 25, alignItems: 'center', justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});