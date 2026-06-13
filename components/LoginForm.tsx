import { useState } from 'react'
import {
    ActivityIndicator, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native'
import { useAuth } from '../hooks/useAuth'

export default function LoginForm() {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cashi 💰</Text>
      <Text style={styles.subtitle}>
        {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>
              {isRegister ? 'Registrarse' : 'Iniciar sesión'}
            </Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setIsRegister(!isRegister); setError('') }}>
        <Text style={styles.toggle}>
          {isRegister
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'
          }
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, fontSize: 16, marginBottom: 12,
  },
  error: { color: 'red', fontSize: 13, marginBottom: 8 },
  btn: {
    backgroundColor: '#007AFF', padding: 16,
    borderRadius: 10, alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  toggle: { color: '#007AFF', textAlign: 'center', marginTop: 16, fontSize: 14 },
})