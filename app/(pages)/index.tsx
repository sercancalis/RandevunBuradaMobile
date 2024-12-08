import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import GooglePlacesAPI from "@/utils/GooglePlacesAPI";
import { PlaceModel } from "@/Models/PlaceModel";
import PlaceListView from "@/components/PlaceListView";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import usePermissionsStore from "@/store/permissionsStore";
import { categories } from "@/constants";

interface IndexPageProps { }

const IndexPage: React.FC<IndexPageProps> = (props) => {
  const router = useRouter();
  const [placeList, setPlaceList] = useState<PlaceModel[]>([]);
  const [popularPlaceList, setPopularPlaceList] = useState<PlaceModel[]>([]);
  const [search, setSearch] = useState("");
  const location = usePermissionsStore((state) => state.location);

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);


  const GetNearByPlace = (tab: number) => {
    setLoading(true);
    const data = {
      includedTypes: [categories[tab].value],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 1000.0,
        },
      },
    };

    GooglePlacesAPI.NewNearByPlace(data)
      .then((res) => {
        setPlaceList(res.data?.places);
        console.log(placeList[0])
        setPopularPlaceList(
          [...res.data.places].sort((a: any, b: any) => b.rating - a.rating)
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log("Error fetching places:", e);
        setLoading(false);
      });
  };

  useEffect(() => {
    setPlaceList([]);
    GetNearByPlace(selectedTab);
  }, [selectedTab]);

  return (
    <ScrollView style={styles.container}>
      <Header showLogo hideShadow />
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View style={{ position: "relative", marginBottom: 20 }}>
          <TextInput
            style={{
              borderWidth: 0.5,
              padding: 10,
              borderRadius: 20,
              borderColor: "gray",
              paddingLeft: 40,
              fontFamily: "Poppins_500Medium",
            }}
            placeholder="Arama"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons
            name="search"
            style={{ position: "absolute", top: 10, left: 10 }}
            size={20}
            color={"gray"}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ececec",
            marginBottom: 15,
            padding: 5,
            borderRadius: 100,
            gap: 10,
          }}
        >
          {categories.map((tab: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={{
                padding: 5,
                paddingHorizontal: index === selectedTab ? 10 : 5,
                backgroundColor: index === selectedTab ? "#000" : "transparent",
                borderRadius: 50,
              }}
              onPress={() => setSelectedTab(index)}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600Medium",
                  fontSize: 14,
                  color: index === selectedTab ? "#fff" : "gray",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 20 }}>
            Yakınındaki Noktalar
          </Text>
          <FontAwesome
            name="chevron-right"
            size={20}
            onPress={() =>
              router.push({
                pathname: "/(pages)/list-hairdressers",
                params: {
                  placeList: JSON.stringify(placeList),
                  title: "Yakınındaki Noktalar",
                },
              })
            }
          />
        </View>
        <PlaceListView
          placeList={placeList.filter((x) =>
            x.displayName.text
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          )}
          loading={loading}
        />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 20 }}>
            Popüler Yerler
          </Text>
          <FontAwesome
            name="chevron-right"
            size={20}
            onPress={() =>
              router.push({
                pathname: "/(pages)/list-hairdressers",
                params: {
                  placeList: JSON.stringify(popularPlaceList),
                  title: "Popüler Yerler",
                },
              })
            }
          />
        </View>
        <PlaceListView
          placeList={popularPlaceList.filter((x) =>
            x.displayName.text
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          )}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
