import { PlaceModel } from "@/Models/PlaceModel";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
} from "react-native";

interface RenderPlaceItemProps {
  item: PlaceModel;
}

const { width, height } = Dimensions.get("screen");
const RenderPlaceItem: React.FC<RenderPlaceItemProps> = (props) => {
  const router = useRouter();
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${props.item.location.latitude},${props.item.location.longitude}`;
    Linking.openURL(url);
  };

  const getAdjustedDay = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  };

  return (
    <TouchableOpacity
      style={styles.placeItem}
      onPress={() =>
        router.push({
          pathname: "/(pages)/hairdressers-detail",
          params: {
            place: JSON.stringify(props.item),
          },
        })
      }
    >
      {props.item.photos ? (
        <Image
          source={{
            uri: `https://places.googleapis.com/v1/${props.item.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`,
          }}
          alt="Resim"
          height={height / 5}
          style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
        />
      ) : (
        <Image
          source={require("@/assets/images/randevu_burada_logo.png")}
          alt="Logo Icon"
          style={{
            width: width * 0.75,
            height: height / 5,
            backgroundColor: "white",
            borderBottomWidth: 0.5,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
          resizeMode="contain"
        />
      )}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 20,
          }}
        >
          <Text style={styles.placeName}>{props.item.displayName.text}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                color: Colors.light.text,
                fontSize: 10,
                width: width / 1.7,
              }}
            >
              {`${props.item.addressComponents[4].shortText}/${
                props.item.addressComponents[3].shortText
              } - ${props.item.nationalPhoneNumber ?? ""}`}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                color: props.item.regularOpeningHours?.openNow
                  ? "green"
                  : "red",
                fontSize: 11,
              }}
            >
              {`${props.item.regularOpeningHours?.openNow ? "Açık" : "Kapalı"}`}
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: Colors.light.text,
                  fontSize: 11,
                }}
              >{` - ${
                props.item.regularOpeningHours?.weekdayDescriptions[
                  getAdjustedDay()
                ] ?? "Bilinmiyor"
              }`}</Text>
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <FontAwesome name="star" color={Colors.light.red} />
              <Text style={{ fontFamily: "Poppins_700Bold" }}>
                {`${props.item.rating ?? 0} (${
                  props.item.userRatingCount ?? 0
                })`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.light.red,
              borderRadius: 50,
              margin: 5,
              padding: 2,
              flex: 1,
            }}
            onPress={openGoogleMaps}
          >
            <Image
              source={require("@/assets/images/randevu_burada_appicon_white.png")}
              alt="Logo Icon"
              style={{
                width: 30,
                height: 30,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default RenderPlaceItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
