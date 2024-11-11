import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OrComponentProps {}

const OrComponent: React.FC<OrComponentProps> = (props) => {
  return (
    <View style={styles.seperatorView}>
      <View
        style={{
          flex: 1,
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text style={styles.seperator}>ya da</Text>
      <View
        style={{
          flex: 1,
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
};
export default OrComponent;

const styles = StyleSheet.create({
  seperatorView: {
    flexDirection: "row",
    alignItems: "center",
  },
  seperator: {
    fontFamily: "Poppins_600SemiBold",
    color: "#cecece",
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
