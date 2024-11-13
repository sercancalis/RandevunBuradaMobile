import { create } from "zustand";

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface PermissionsState {
  location: Location;
  setLocation: (location: Location) => void;
}

const usePermissionsStore = create<PermissionsState>((set) => ({
  location: {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  setLocation: (location: Location) => set({ location: location }),
}));

export default usePermissionsStore;
