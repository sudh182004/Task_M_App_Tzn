import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { registerUser } from '../services/api';
import ToastMessage from '../components/ToastMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      setToast('Please fill all fields')
 
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(email, password);
      if (res.token) {
          await AsyncStorage.setItem('token', res.token);
        }
      setToast('Account created')
  
      navigation.navigate('Home');
    } catch (e) {
      setToast(e.message || 'Signup failed')
 
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

     
      {toast ? <ToastMessage text={toast} onHide={() => setToast('')} /> : null}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? <Text style={styles.linkBold}>Login</Text>
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
    letterSpacing: 0.5,
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
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#f1c40f',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#f1c40f',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#0b0c10', 
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    fontWeight: '700',
  },
});
