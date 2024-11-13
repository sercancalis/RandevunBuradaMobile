import { PlaceModel } from "@/Models/PlaceModel";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import HeaderPage from "@/components/HeaderPage";

interface HairdressersDetailProps {}

const HairdressersDetail: React.FC<HairdressersDetailProps> = (props) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const { place } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";
  const { width, height } = Dimensions.get("screen");

  const parsedData: PlaceModel | null = place
    ? JSON.parse(place as string)
    : null;

  useEffect(() => {
    if (!parsedData) {
      router.push("/");
    }
  }, [parsedData, router]);

  if (!parsedData) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderPage title=""/>
      <View
        style={{
          height: height,
          backgroundColor: "white",
          paddingVertical: 20,
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
        <View style={{ position: "relative", height: height / 4 }}>
          <Carousel
            loop
            mode="parallax"
            width={width}
            height={width / 2}
            data={parsedData.photos}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log("current index:", index)}
            renderItem={({ item, index }) => (
              <Image
                source={{
                  uri: `https://places.googleapis.com/v1/${item.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`,
                }}
                alt="Resim"
                height={width / 2}
                style={{ borderRadius: 10 }}
                defaultSource={require("@/assets/images/randevu_burada_logo.png")}
              />
            )}
          />
        </View>
        <View style={{ paddingHorizontal: 20, gap: 3 }}>
          <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
            {parsedData.displayName.text}
          </Text>
          <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}>
            {parsedData.shortFormattedAddress}
          </Text>

          {parsedData.nationalPhoneNumber && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `tel:${parsedData.internationalPhoneNumber.replace(
                    /\s+/g,
                    ""
                  )}`
                )
              }
            >
              <Text
                style={{
                  color: "blue",
                  textDecorationLine: "underline",
                }}
              >
                {parsedData.nationalPhoneNumber}
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <FontAwesome name="star" color={"red"} />
            <Text style={{ fontFamily: "Poppins_700Bold" }}>
              {`${parsedData.rating ?? 0} (${parsedData.userRatingCount ?? 0})`}
            </Text>
          </View>

          <View
            style={{
              marginVertical: 20,
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
            }}
          >
            <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
              Çalışma Saatleri{" "}
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: parsedData.regularOpeningHours?.openNow
                    ? "green"
                    : "red",
                  fontSize: 11,
                }}
              >
                {`(${
                  parsedData.regularOpeningHours?.openNow ? "Açık" : "Kapalı"
                })`}
              </Text>
            </Text>
            {parsedData.regularOpeningHours?.weekdayDescriptions?.map(
              (data: any, index: number) => {
                var day = data.split(": ")[0];
                var hour = data.split(": ")[1];
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 12,
                        color: "red",
                        flex: 1,
                      }}
                    >
                      {day}:
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Poppins_600SemiBold",
                        fontSize: 12,
                        color: "black",
                        flex: 1,
                      }}
                    >
                      {hour}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#F99335",
              padding: 10,
              alignItems: "center",
              borderRadius: 10,
              marginTop: 50,
            }}
          >
            <Text style={{ color: "white", fontFamily: "Poppins_600SemiBold" }}>
              Randevu Al
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default HairdressersDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
