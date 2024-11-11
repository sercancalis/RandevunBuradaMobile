import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  GooglePlacesAutocomplete,
  Point,
} from "react-native-google-places-autocomplete";

interface MapHeaderProps {
  seachedLocation: (location: Point) => void;
}

const MapHeader: React.FC<MapHeaderProps> = (props) => {
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 5,
        backgroundColor: "white",
        borderRadius: 6,
      }}
    >
      <Ionicons
        name="location-sharp"
        size={24}
        color={"gray"}
        style={{ paddingTop: 10 }}
      />
      <GooglePlacesAutocomplete
        placeholder="Ara..."
        fetchDetails={true}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "tr",
        }}
        onPress={(data, details = null) => {
          if (details) {
            props.seachedLocation(details?.geometry?.location);
          }
        }}
        onFail={(error) => console.error(error)}
      />
    </View>
  );
};
export default MapHeader;

const styles = StyleSheet.create({});
