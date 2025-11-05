import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur'; 

export default function ToastMessage({ text, onHide }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!text) return;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => handleClose(), 2000);
    return () => clearTimeout(timer);
  }, [text]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.8, duration: 150, useNativeDriver: true }),
    ]).start(() => onHide && onHide());
  };

  if (!text) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <BlurView intensity={80} tint="dark" style={styles.blurBackground}>
        <Animated.View style={[styles.dialogBox, { transform: [{ scale }] }]}>
          <Text style={styles.messageText}>{text}</Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    width: '78%',
    backgroundColor: '#1a1a1a', 
    borderRadius: 16,
    paddingVertical: 26,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(241,196,15,0.3)', 
    shadowColor: '#f1c40f',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 10,
  },
  messageText: {
    fontSize: 18,
    color: '#f1f1f1', 
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#f1c40f', 
    paddingVertical: 10,
    paddingHorizontal: 34,
    borderRadius: 10,
    shadowColor: '#f1c40f',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#1a1a1a', 
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
