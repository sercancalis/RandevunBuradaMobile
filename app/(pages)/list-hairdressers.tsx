import { PlaceModel } from "@/Models/PlaceModel";
import RenderVerticalPlaceItem from "@/components/RenderVerticalPlaceItem";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  FlatList,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ListHairdressersProps {}

const ListHairdressers: React.FC<ListHairdressersProps> = (props) => {
  const { placeList, title } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";

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
      <View
        style={[
          {
            paddingTop: insets.top + 20,
            padding: 20,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text style={{ fontFamily: "Poppins_600SemiBold", color: "#000" }}>
            {title}
          </Text>
          <FontAwesome
            name="chevron-left"
            size={20}
            onPress={() => router.back()}
            style={{ position: "absolute", left: 0 }}
          />
        </View>
      </View>
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
