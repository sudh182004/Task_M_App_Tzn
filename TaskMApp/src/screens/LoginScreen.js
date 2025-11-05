import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/api';
import ToastMessage from '../components/ToastMessage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setToast('Please fill all fields')

      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);

      if (res.success) {
        // Save token in AsyncStorage for auto-login
        if (res.token) {
          await AsyncStorage.setItem('token', res.token);
        }
        setToast("Login successful!");
    
        navigation.replace('Home');
      } else {
        setToast('Invalid credentials');
     
      }
    } catch (err) {
      console.log(err);
      setToast(err.message || 'Login failed')

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      {toast ? <ToastMessage text={toast} onHide={() => setToast('')} /> : null}
     

      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Don’t have an account? <Text style={styles.linkBold}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0b0c10',
    paddingHorizontal: 25,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1c40f', 
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2d3436',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 15,
    backgroundColor: '#1c1f26',
  },
  button: {
    backgroundColor: '#f1c40f',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0b0c10',
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    color: '#27ae60', 
    marginTop: 12,
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#bdc3c7',
  },
  linkBold: {
    color: '#f1c40f',
    fontWeight: 'bold',
  },
});
