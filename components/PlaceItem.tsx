import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

interface PlaceItemProps {
  place: any;
}

const PlaceItem: React.FC<PlaceItemProps> = (props) => {
  return (
    <View
      style={{
        backgroundColor: "",
        width: Dimensions.get("screen").width,
      }}
    >
      <Image
        source={require("@")}
        style={{ width: "100%", borderRadius: 10, height: 130 }}
      />
    </View>
  );
};
export default PlaceItem;

const styles = StyleSheet.create({});
