import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      try {
        console.log("hhhh")
        await AsyncStorage.removeItem('token'); // Clear token
        navigation.navigate('Login'); // Redirect to login
      } catch (err) {
        console.error('Logout error:', err);
      }
    };
    logout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { marginTop: 15, color: '#000', fontSize: 16 },
});
