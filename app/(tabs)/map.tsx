import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import GooglePlacesAPI from "@/utils/GooglePlacesAPI";
import { PlaceModel } from "@/Models/PlaceModel";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import usePermissionsStore from "@/store/permissionsStore";

interface MapPageProps {}

const MapPage: React.FC<MapPageProps> = () => {
  const [placeList, setPlaceList] = useState<PlaceModel[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceModel | null>(null);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const [isLoading, setIsLoading] = useState(false);
  const { location } = usePermissionsStore.getState();
  const GetNearByPlace = (field: string) => {
    const data = {
      includedTypes: [field],
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
        setPlaceList((prevList) => [...prevList, ...res.data?.places]);
      })
      .catch((e) => console.log("Error fetching places:", e));
  };

  useEffect(() => {
    if (isLoading) {
      const fields = ["beauty_salon", "hair_care", "spa"];
      setPlaceList([]);
      fields.forEach((field) => GetNearByPlace(field));
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        region={location}
        style={{ flex: 1 }}
        showsMyLocationButton
        zoomEnabled
      >
        {placeList.map((place, index) => (
          <Marker
            key={index}
            coordinate={place.location}
            onPress={() => setSelectedPlace(place)}
          />
        ))}
      </MapView>

      {/* Popup gösterme */}
      {selectedPlace && (
        <View style={styles.popupContainer}>
          <Image
            source={{
              uri: `https://places.googleapis.com/v1/${selectedPlace.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`,
            }}
            style={styles.placeImage}
          />
          <Text style={styles.placeName}>{selectedPlace.displayName.text}</Text>
          <Text style={styles.placeDescription}>
            {`${selectedPlace.addressComponents[4].shortText}/${selectedPlace.addressComponents[3].shortText}`}
          </Text>
          {selectedPlace.nationalPhoneNumber && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `tel:${selectedPlace.internationalPhoneNumber.replace(
                    /\s+/g,
                    ""
                  )}`
                )
              }
            >
              <Text style={[styles.placeDescription, styles.phoneText]}>
                {selectedPlace.nationalPhoneNumber}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setSelectedPlace(null)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MapPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  popupContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  placeImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  placeDescription: {
    fontSize: 14,
    color: "#555",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  phoneText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
