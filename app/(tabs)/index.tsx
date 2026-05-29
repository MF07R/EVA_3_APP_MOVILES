import type { Href } from 'expo-router';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../types';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, loading, loadTransactions, deleteTransaction } = useTransactions();
  const { categories, loadCategories } = useCategories();

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
      loadTransactions();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const cat = getCategoryById(item.categoryId);
    return (
      <View style={styles.item}>
        <View>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.cat}>{cat?.name ?? 'Sin categoría'}</Text>
        </View>
        <View style={styles.right}>
          <Text style={item.type === 'income' ? styles.income : styles.expense}>
            {item.type === 'income' ? '+' : '-'}${item.amount}
          </Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => router.push(`/transaction/${item.id}` as Href)}>
              <Text style={styles.edit}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>Borrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={styles.loader} color="#000" />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={t => t.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay transacciones</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/transaction/new' as Href)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1 },
  item: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 12, borderBottomWidth: 1, borderColor: '#eee',
  },
  desc: { fontSize: 16, fontWeight: '600' },
  cat: { fontSize: 13, color: '#888', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  income: { fontSize: 16, color: 'green', fontWeight: '600' },
  expense: { fontSize: 16, color: 'red', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  edit: { color: '#007AFF', fontSize: 13 },
  delete: { color: 'red', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 60, color: '#888' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#007AFF', width: 50, height: 50,
    borderRadius: 25, alignItems: 'center', justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});