import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTransactions } from '../../hooks/useTransactions';

export default function BalanceScreen() {
  const { totalIncome, totalExpense, balance, loading, loadTransactions } = useTransactions();

  useFocusEffect(
    useCallback(() => { loadTransactions(); }, [])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#000" />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resumen financiero</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Ingresos</Text>
        <Text style={styles.income}>${totalIncome}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Egresos</Text>
        <Text style={styles.expense}>${totalExpense}</Text>
      </View>

      <View style={[styles.row, styles.balanceRow]}>
        <Text style={styles.label}>Balance</Text>
        <Text style={balance >= 0 ? styles.income : styles.expense}>
          ${balance}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eee',
  },
  balanceRow: { borderBottomWidth: 0, marginTop: 8 },
  label: { fontSize: 16, color: '#444' },
  income: { fontSize: 16, color: 'green', fontWeight: '600' },
  expense: { fontSize: 16, color: 'red', fontWeight: '600' },
});