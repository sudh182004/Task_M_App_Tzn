import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BackButton() {
  const navigation = useNavigation(); 

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a1a", 
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1c40f",
    shadowColor: "#f1c40f",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  backButtonText: {
    color: "#f1c40f", 
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
