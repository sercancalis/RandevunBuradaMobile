import React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
} from "react-native";
import { PlaceModel } from "@/Models/PlaceModel";
import RenderPlaceItem from "./RenderPlaceItem";

interface PlaceListViewProps {
  placeList: PlaceModel[];
  category: string;
  loading: boolean;
}

const { width } = Dimensions.get("screen");
const PlaceListView: React.FC<PlaceListViewProps> = (props) => {
  return (
    <View>
      {props.loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={props.placeList}
          horizontal
          renderItem={({ item, index }) => (
            <RenderPlaceItem item={item} category={props.category} key={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.container}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Kayıt Bulunamadı</Text>
          }
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};
export default PlaceListView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 20,
  },
  placeItem: {
    width: width * 0.75,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
