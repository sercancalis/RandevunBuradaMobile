import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import usePermissionsStore from '@/store/permissionsStore';
import GooglePlacesAPI from '@/utils/GooglePlacesAPI';
import { categories } from '@/constants';
import { PlaceModel } from '@/Models/PlaceModel';
import Carousel from 'react-native-reanimated-carousel'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

interface SelectLocationProps {
  onSelectLocation: (category: string, name: string, latitude: number, longitude: number, city: string, district: string, address: string, phoneNumber: string, images: string[], workingHours: { workingDay: number, value: string }[]) => void;
  onClose: () => void;
}

const { width, height } = Dimensions.get("screen");

const SelectLocation: React.FC<SelectLocationProps> = ({ onSelectLocation, onClose }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useWarmUpBrowser();

  const { location } = usePermissionsStore.getState();

  const [markers, setMarkers] = useState<PlaceModel[]>([]);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const [selectedMarker, setSelectedMarker] = useState<PlaceModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const GetNearByPlace = async () => {
    setIsLoading(true);
    let allPlaces: PlaceModel[] = [];
    for (const category of categories) {
      const data = {
        includedTypes: [category.value],
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

      const places = await GooglePlacesAPI.NewNearByPlace(data);
      const placesWithCategory = places.data.places.map((place: any) => ({
        ...place,
        category: category.value,
      }));
      allPlaces = [...allPlaces, ...placesWithCategory];
    }
    const uniquePlaces = allPlaces.filter(
      (place, index, self) =>
        index === self.findIndex((p) => p.name === place.name)
    );

    setIsLoading(false);
    setMarkers(uniquePlaces);
  };

  useEffect(() => {
    GetNearByPlace();
  }, [location])

  const extractHours = (data: string) => {
    const parts = data.split(":");
    if (parts.length > 1) {
      return parts.slice(1).join(":").trim(); // Eğer ":" varsa, ilk kısmı çıkar ve geri kalanı döndür
    }
    return ""; // Eğer ":" yoksa, boş string döndür
  };

  const handleSelect = () => {
    if (selectedMarker) {
      //@ts-ignore
      var category = selectedMarker.category;
      var name = selectedMarker.displayName.text;
      var latitude = selectedMarker.location.latitude;
      var longitude = selectedMarker.location.longitude;
      var address = selectedMarker.formattedAddress;
      var city = selectedMarker.addressComponents[4].shortText;
      var district = selectedMarker.addressComponents[3].shortText;
      var phoneNumber = selectedMarker.nationalPhoneNumber;
      var images = selectedMarker.photos.map(x => `https://places.googleapis.com/v1/${x.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`);
      var workingHours: { workingDay: number, value: string }[] = [];
      selectedMarker.regularOpeningHours.weekdayDescriptions.map((data: any, index: number) => {
        workingHours.push(
          { workingDay: index, value: extractHours(data) },
        )
      })

      onSelectLocation(category, name, latitude, longitude, city, district, address, phoneNumber, images, workingHours);
    }
  }
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>

        <TouchableOpacity onPress={onClose} style={{ position: "absolute", top: 50, right: 30, zIndex: 999, backgroundColor: "white", borderRadius: 20 }} >
          <FontAwesome name="times-circle" size={30} />
        </TouchableOpacity>

        <MapView
          style={styles.map}
          initialRegion={location}
          loadingEnabled={isLoading}
        >

          {markers?.map((marker) => (
            <Marker
              key={`${marker.location.latitude}-${marker.location.longitude}`}
              coordinate={{ latitude: marker.location.latitude, longitude: marker.location.longitude }}
              onPress={() => {
                setSelectedMarker(marker);
                handlePresentModalPress();
              }}>
              <Image source={require("@/assets/images/kuafor_pin_icon.png")} />
            </Marker>

          ))}

          <BottomSheetModal ref={bottomSheetModalRef}>
            <BottomSheetView style={styles.contentContainer}>
              <View style={{ flex: 1 }}>
                <Carousel
                  loop
                  mode="parallax"
                  width={width}
                  height={width / 2.5}
                  data={selectedMarker?.photos ?? []}
                  scrollAnimationDuration={1000}
                  onSnapToItem={(index) => console.log("current index:", index)}
                  renderItem={({ item, index }) => (
                    <Image
                      source={{
                        uri: `https://places.googleapis.com/v1/${item.name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`,
                      }}
                      alt="Resim"
                      height={width / 2.5}
                      style={{ borderRadius: 10 }}
                      defaultSource={require("@/assets/images/randevu_burada_logo.png")}
                    />
                  )}
                />
              </View>

              <View style={{ flex: 2.5, gap: 3, width: "100%" }}>
                <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
                  {selectedMarker?.displayName.text}
                </Text>
                <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}>
                  {selectedMarker?.shortFormattedAddress}
                </Text>

                {selectedMarker?.nationalPhoneNumber && (
                  <Text
                    style={{
                      color: "blue",
                      textDecorationLine: "underline",
                    }}
                  >
                    {selectedMarker.nationalPhoneNumber}
                  </Text>
                )}

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
                        color: selectedMarker?.regularOpeningHours?.openNow
                          ? "green"
                          : "red",
                        fontSize: 11,
                      }}
                    >
                      {`(${selectedMarker?.regularOpeningHours?.openNow ? "Açık" : "Kapalı"
                        })`}
                    </Text>
                  </Text>
                  {selectedMarker?.regularOpeningHours?.weekdayDescriptions?.map(
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

                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "orange", padding: 10, borderRadius: 10 }} onPress={handleSelect}>
                  <Text style={{ color: "white", fontFamily: "Poppins_600SemiBold", fontSize: 16 }}>İşletme Bilgilerini Seç</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </MapView >
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: "relative"
  },
  contentContainer: {
    height: height / 1.6,
    paddingHorizontal: 20,
  },
});

export default SelectLocation;
