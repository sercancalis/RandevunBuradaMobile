import { PlaceModel } from "@/Models/PlaceModel";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
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

interface RenderVerticalPlaceItemProps {
  item: PlaceModel;
}

const { width, height } = Dimensions.get("screen");
const RenderVerticalPlaceItem: React.FC<RenderVerticalPlaceItemProps> = (
  props
) => {
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
    <TouchableOpacity style={styles.placeItem}>
      {props.item.photos ? (
        <Image
          source={{
            uri: `https://places.googleapis.com/v1/${props.item.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`,
          }}
          alt="Resim"
          height={height / 5}
          style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
          defaultSource={require("@/assets/images/randevu_burada_logo.png")}
        />
      ) : (
        <Image
          source={require("@/assets/images/randevu_burada_logo.png")}
          alt="Logo Icon"
          style={{
            width: width * 0.9,
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
          gap: 5,
        }}
      >
        <Text style={styles.placeName}>{props.item.displayName.text}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "90%" }}>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                color: Colors.light.text,
                fontSize: 11,
              }}
            >
              {`${props.item.addressComponents[4].shortText} / ${props.item.addressComponents[3].shortText}`}
            </Text>
            {props.item.nationalPhoneNumber && (
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  color: Colors.light.text,
                  fontSize: 11,
                }}
              >
                {`${props.item.nationalPhoneNumber}`}
              </Text>
            )}
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
                {`${props.item.rating ?? 0}`}
                <Text style={{ fontSize: 10 }}>{` ( ${
                  props.item.userRatingCount ?? 0
                } )`}</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.light.red,
              borderRadius: 50,
              padding: 2,
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
export default RenderVerticalPlaceItem;

const styles = StyleSheet.create({
  container: {},
  placeItem: {
    paddingHorizontal: 20,
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
