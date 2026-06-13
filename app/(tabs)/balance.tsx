import { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { apiService } from '../../services/api'

export default function BalanceScreen() {
  const { token } = useAuth()
  const [balance, setBalance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    apiService.get<any>('/transactions/balance', token)
      .then(setBalance)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Balance</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Ingresos</Text>
        <Text style={styles.income}>${balance?.totalIncome ?? 0}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Egresos</Text>
        <Text style={styles.expense}>${balance?.totalExpense ?? 0}</Text>
      </View>
      <View style={[styles.row, styles.balanceRow]}>
        <Text style={styles.label}>Balance</Text>
        <Text style={balance?.balance >= 0 ? styles.income : styles.expense}>
          ${balance?.balance ?? 0}
        </Text>
      </View>
    </SafeAreaView>
  )
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
})