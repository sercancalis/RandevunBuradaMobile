import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

interface ImageAsset {
  uri: string;
}

const ImageUploadScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [multipleSelect, setMultipleSelect] = useState<boolean>(false);
  const [albums, setAlbums] = useState<MediaLibrary.Album[] | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(
    null
  );
  const [isAlbumModalVisible, setIsAlbumModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Galeriye erişim izni verilmedi.");
        return;
      }

      loadAlbums();
    })();
  }, []);

  const loadAlbums = async () => {
    const albumAssets = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });

    setAlbums(albumAssets);
    if (albumAssets.length > 0) {
      setSelectedAlbum(albumAssets[0]); // İlk albüm "Son Kaydedilenler" gibi olabilir
      loadImages(albumAssets[0].id); // İlk albümden resimleri yükle
    }
  };

  const loadImages = async (albumId: string) => {
    const albumAssets = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 50,
      album: albumId,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });

    setImages(albumAssets.assets); // Fotoğrafları state'e set ediyoruz
    if (albumAssets.assets.length > 0) {
      setSelectedImage(albumAssets.assets[0].uri); // İlk resmi seçili olarak göster
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        setSelectedImage(result.assets[0].uri); // Seçilen resmi göster
      }
    }
  };

  const handleAlbumSelect = (album: MediaLibrary.Album) => {
    setSelectedAlbum(album);
    loadImages(album.id); // Albüm seçilince resimleri yükle
    setIsAlbumModalVisible(false); // Modalı kapat
  };

  return (
    <View style={styles.container}>
      {/* Üstteki 4:3 oranında resim alanı */}
      <View style={styles.imagePreview}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.noImageText}>Resim seçin</Text>
        )}
      </View>

      {/* Alttaki galeri seçim kısmı */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setIsAlbumModalVisible(true)}>
          <Text style={styles.albumText}>
            {selectedAlbum ? selectedAlbum.title : "Son Kaydedilenler"}
          </Text>
        </TouchableOpacity>
        <View style={styles.icons}>
          {/* Çoklu seçim simgesi */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setMultipleSelect(!multipleSelect)}
          >
            <Feather
              name={multipleSelect ? "check-square" : "square"}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          {/* Kamera simgesi */}
          <TouchableOpacity style={styles.iconButton} onPress={openCamera}>
            <Feather name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Galeriden resim seçimi için yatay liste */}
      <FlatList
        data={images}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedImage(item.uri)}>
            <Image
              source={{ uri: item.uri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
      />

      {/* Albüm seçim modalı */}
      <Modal visible={isAlbumModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Albüm Seç</Text>
            <FlatList
              data={albums}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAlbumSelect(item)}>
                  <Text style={styles.modalItem}>{item.title}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
            <Pressable
              onPress={() => setIsAlbumModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ImageUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imagePreview: {
    width: "100%",
    aspectRatio: 4 / 3, // 4:3 oranı
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 16,
    color: "#888",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eaeaea",
  },
  albumText: {
    fontSize: 16,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
  },
});
