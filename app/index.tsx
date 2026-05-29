import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import { useState } from 'react';


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (text: string) => {
        setEmail(text);
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text);
    }

    const handleLogin = () => {
  if (email !== "mafer@cashi.cl" || password !== "1234") {
    setError("Credenciales inválidas, intente de nuevo");
    return;
  }
  setError("");
  router.push({
    pathname: "/(tabs)",
    params: { email }
  });
};
      


    return (
        <View style={styles.container}> 
        <Text>Login Screen</Text>

        <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleEmailChange}
            style={styles.input}
        />
        
        <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {error ? <Text style={{ color: "red", marginTop: 10}}>{error}</Text> : null}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tittle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },

    input: {
        width: "80%",
        height: 40,
        borderColor: "white",
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        color: "white"
    },

    button: {
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: "80%",
        alignItems: "center"
    },

    buttonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold"
    }




})