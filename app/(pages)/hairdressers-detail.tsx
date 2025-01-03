import { PlaceModel } from "@/Models/PlaceModel";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import HeaderPage from "@/components/HeaderPage";
import { getBusinessList } from "@/services/BusinessService";

interface HairdressersDetailProps {
}

const HairdressersDetail: React.FC<HairdressersDetailProps> = (props) => {
  const isShowImage = process.env.EXPO_PUBLIC_SHOW_IMAGE === "1";
  const [showAppointmentButton, setShowAppointmentButton] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const { place, category } = useLocalSearchParams();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

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

  const getBusinessListService = async () => {
    try {
      var res = await getBusinessList(category as string);

      if (res?.status == 200 && res?.data?.items) {
        var list = res.data.items;
        var findBusiness = list.find((x: any) => x.latitude == parsedData.location.latitude && x.longitude == parsedData.location.longitude);
        if (findBusiness) {
          setBusiness(findBusiness);
          const now = new Date();
          const currentDay = getCustomDay(now.getDay()); // Düzenlenmiş gün (0: Pazartesi, 1: Salı, ...)
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const todaysWorkingHours = findBusiness.workingHours.find((wh: any) => wh.workingDay === currentDay);
          if (!todaysWorkingHours) {
            return false; // Bugün için çalışma saati yoksa false döner
          }

          const [start, end] = todaysWorkingHours.value.split("–").map((time: any) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes; // Dakika cinsinden döndür
          });

          if (currentTime >= start && currentTime <= end) {
            setShowAppointmentButton(true)
          }

        }
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (category) getBusinessListService()
  }, [category])

  const getWorkingHourString = (day: number) => {
    switch (day) {
      case 0: return "Pazartesi";
      case 1: return "Salı";
      case 2: return "Çarşamba";
      case 3: return "Perşembe";
      case 4: return "Cuma";
      case 5: return "Cumartesi";
      case 6: return "Pazar";
      default: return ""
    }
  }

  // Mevcut günü dönüştüren fonksiyon
  const getCustomDay = (day: number) => (day === 0 ? 6 : day - 1);

  return (
    <ScrollView style={styles.container}>
      <HeaderPage title="" />
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
            data={showAppointmentButton ? business.imageUrls : parsedData.photos}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log("current index:", index)}
            renderItem={({ item, index }: any) => (
              isShowImage ?
                showAppointmentButton ?
                  <Image
                    source={{
                      uri: item as string
                    }}
                    alt="Resim"
                    height={width / 2}
                    style={{ borderRadius: 10 }}
                    defaultSource={require("@/assets/images/randevu_burada_logo.png")}
                  /> :
                  <Image
                    source={{
                      uri: `https://places.googleapis.com/v1/${item.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`,
                    }}
                    alt="Resim"
                    height={width / 2}
                    style={{ borderRadius: 10 }}
                    defaultSource={require("@/assets/images/randevu_burada_logo.png")}
                  />
                :
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
          />
        </View>
        <View style={{ paddingHorizontal: 20, gap: 3 }}>
          <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
            {showAppointmentButton ? business.name : parsedData?.displayName?.text} {showAppointmentButton ? 1 : 0}
          </Text>
          <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}>
            {showAppointmentButton ? business.address : parsedData.shortFormattedAddress}
          </Text>

          {(parsedData.nationalPhoneNumber || business.phoneNumber) && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `tel:${(showAppointmentButton ? business.phoneNumber : parsedData.internationalPhoneNumber).replace(
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
                {showAppointmentButton ? business.phoneNumber : parsedData.nationalPhoneNumber}
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
              {!business && (<Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: parsedData.regularOpeningHours?.openNow
                    ? "green"
                    : "red",
                  fontSize: 11,
                }}
              >
                {`(${parsedData.regularOpeningHours?.openNow ? "Açık" : "Kapalı"
                  })`}
              </Text>)}
            </Text>
            {showAppointmentButton ? business.workingHours.map((data: any, index: number) => {
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
                    {getWorkingHourString(data.workingDay)}:
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 12,
                      color: "black",
                      flex: 1,
                    }}
                  >
                    {data.value}
                  </Text>
                </View>
              )
            }) : parsedData.regularOpeningHours?.weekdayDescriptions?.map(
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
          {showAppointmentButton && <TouchableOpacity
            style={{
              backgroundColor: "#F99335",
              padding: 10,
              alignItems: "center",
              borderRadius: 10,
              marginTop: 50,
            }}
            onPress={() =>
              router.push({
                pathname: "/(pages)/appointment",
                params: {
                  businessId: business.id
                },
              })
            }
          >
            <Text style={{ color: "white", fontFamily: "Poppins_600SemiBold" }}>
              Randevu Al
            </Text>
          </TouchableOpacity>
          }
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
