import usePermissionsStore from "@/store/permissionsStore";
import * as Location from "expo-location";

export const requestLocationPermissions = async () => {
  const { setLocation } = usePermissionsStore.getState();
  // Konum izni iste
  const locationResponse = await Location.requestForegroundPermissionsAsync();
  if (locationResponse.status === "granted") {
    const location = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  } else {
    setLocation({
      latitude: 41.0082,
      longitude: 28.9784,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }
};
