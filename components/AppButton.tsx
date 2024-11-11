import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
}

const AppButton: React.FC<AppButtonProps> = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
export default AppButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
