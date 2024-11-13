import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

interface SelectLocationProps {
  onSelectLocation: (latitude: number, longitude: number, address: string) => void;
  onClose: () => void;
}

const SelectLocation: React.FC<SelectLocationProps> = ({ onSelectLocation, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    var res = await axios.get(geocodeUrl);
    const mockAddress = res.data.results[0].formatted_address;
    setSelectedLocation({ latitude, longitude, address: mockAddress });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log(selectedLocation)
      onSelectLocation(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.address);
      onClose;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={{ position: "absolute", top: 50, right: 30, zIndex: 999, backgroundColor: "white" }} >
        <FontAwesome name="times-circle" size={30} />
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
       <Marker
       coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }}
       icon={{ uri: "@/assets/images/kuafor_pin_icon.png" }}
     />
        )}

      </MapView>
      {selectedLocation && ( 
        <View style={styles.selectedContainer}>
          <View style={styles.buttonContainer}>
            <Button title="Konumu Seç" onPress={handleConfirmLocation} />
            <Button title="Cancel" onPress={() => setSelectedLocation(null)} />
          </View>  
          <Text style={styles.addressText}>{selectedLocation.address}</Text>
          </View>  
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  map: {
    flex:1
  },
  selectedContainer:{
    height:200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 10,
  },
  addressText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default SelectLocation;
