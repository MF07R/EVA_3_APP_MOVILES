import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function IndexScreen() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (token) return <Redirect href="/(tabs)" />;

  return <LoginForm />;
}