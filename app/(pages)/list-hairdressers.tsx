import { PlaceModel } from "@/Models/PlaceModel";
import HeaderPage from "@/components/HeaderPage";
import RenderVerticalPlaceItem from "@/components/RenderVerticalPlaceItem"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet, 
  ScrollView,
} from "react-native"; 

interface ListHairdressersProps {}

const ListHairdressers: React.FC<ListHairdressersProps> = (props) => {
  const { placeList, title } = useLocalSearchParams();
  const router = useRouter(); 

  const parsedPlaceList: PlaceModel[] | null = placeList
    ? JSON.parse(placeList as string)
    : null;

  useEffect(() => {
    if (!parsedPlaceList) {
      router.push("/");
    }
  }, [parsedPlaceList, router]);

  if (!parsedPlaceList) {
    return null;
  }
  return (
    <ScrollView style={styles.container}>
      <HeaderPage title={title as string} />
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 40,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
        }}
      >
        {parsedPlaceList.length === 0 ? (
          <Text style={styles.emptyText}>Kayıt Bulunamadı</Text>
        ) : (
          parsedPlaceList.map((item, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <RenderVerticalPlaceItem item={item} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};
export default ListHairdressers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
