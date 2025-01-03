import CustomInput from "@/components/CustomInput";
import HeaderPage from "@/components/HeaderPage";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  Alert,
  TextInput,
  Platform
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/components/CustomButton";
import WorkingHoursSelector from "@/components/WorkingHoursSelector";
import SelectLocation from "@/components/SelectLocation";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import AppDropdownPicker from "@/components/AppDropDownPicker";
import { categories } from "@/constants";
import { addBusinessService } from "@/services/BusinessService";
import * as ImageManipulator from 'expo-image-manipulator';
import { useUser } from "@clerk/clerk-expo";
import { mainService } from "@/utils/axiosInstance";
import { GetBusinessResponseModel } from "@/services/models/GetBusinessResponseModel";

interface NewHairdressersPageProps {

}

const schema = z.object({
  id: z.number().default(0),
  category: z.string({ required_error: "Lütfen kategori seçiniz" }),
  name: z
    .string({ required_error: "Lütfen işletme adını giriniz" })
    .min(5, { message: "İşletme adı min 5 karakter olabilir." })
    .max(50, { message: "İşletme adı max 50 karakter olabilir." }),
  phoneNumber: z.string({ required_error: "Lütfen işletme telefon numarasını giriniz" }),
  workingHours: z.array(
    z.object({
      workingDay: z.number(),
      value: z.string()
    })),
  location: z.object({
    latitude: z.number({ required_error: "Lütfen konum bilgisi seçiniz" }),
    longitude: z.number({ required_error: "Lütfen konum bilgisi seçiniz" }),
  }),
  address: z.string({ required_error: "Lütfen adres bilgisi giriniz" }),
  city: z.string({ required_error: "Lütfen il bilgisini giriniz" }),
  district: z.string({ required_error: "Lütfen ilçe bilgisini giriniz" }),
  images: z.array(z.string()).min(1, { message: "Lütfen min 1 adet resim ekleyiniz" }),
  isConfirmed: z.boolean().default(false)
});

const NewHairdressersPage: React.FC<NewHairdressersPageProps> = (props) => {
  const { user } = useUser();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      workingHours: [
        { workingDay: 0, value: "09:00-17:00" },
        { workingDay: 1, value: "09:00-17:00" },
        { workingDay: 2, value: "09:00-17:00" },
        { workingDay: 3, value: "09:00-17:00" },
        { workingDay: 4, value: "09:00-17:00" },
        { workingDay: 5, value: "09:00-17:00" },
        { workingDay: 6, value: "Kapalı" },
      ],
      images: []
    }
  });

  const selectImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: 'Fotoğraf için iznininiz bulunmamaktadır.',
        position: "bottom"
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const images = watch("images") || [];
      setValue("images", [...images, Platform.OS === "android" ? result.assets[0].uri : result.assets[0].uri.replace("file://", "")]);
    }
  }

  async function compressImage(uri: string): Promise<string> {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Genişliği 800px'e ayarlar, yüksekliği orantılı olarak otomatik ayarlanır.
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // %70 sıkıştırma ve JPEG formatında kaydeder.
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data: z.infer<typeof schema>) => {
    try {
      var formData = new FormData();
      formData.append("userId", user!.id);
      formData.append("category", data.category);
      formData.append("name", data.name);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("latitude", data.location.latitude.toString());
      formData.append("longitude", data.location.longitude.toString());
      formData.append("city", data.city);
      formData.append("district", data.district);
      formData.append("address", data.address);

      data.workingHours.forEach((hour, index) => {
        formData.append(`workingHours[${index}].workingDay`, hour.workingDay.toString());
        formData.append(`workingHours[${index}].value`, hour.value);
      });

      const selectedImages = watch("images") || [];

      const imageFiles = selectedImages.filter((img) => !img.startsWith("http")); // Picker images
      const imageUrls = selectedImages.filter((img) => img.startsWith("http")); // Predefined URLs

      // Add image URLs to the form data 
      imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });

      const compressedImageUris = await Promise.all(
        imageFiles.map(async (uri) => await compressImage(uri))
      );

      compressedImageUris.map(async (uri) => {
        let filename = uri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename!);
        let type = match ? `image/${match[1]}` : `image`;

        //@ts-ignore
        formData.append('imageFiles', { uri: uri, name: filename, type });
      })
      var res = await addBusinessService(formData);
      if (res?.status == 200 && res.data) {
        Toast.show({
          text1: "İşletmeniz kaydedilmiştir",
          position: "bottom",
          type: "success"
        })
      } else {
        Toast.show({
          text1: "İşletmeniz kaydedilemedi",
          position: "bottom",
          type: "error"
        })
      }
    } catch (error) {
      Toast.show({
        text1: "İşletmeniz kaydedilemedi",
        position: "bottom",
        type: "error"
      })
    }
  };

  const images = watch("images") || [];
  const removeImage = (index: number) => {
    const updatedImages = watch("images").filter((_, i) => i !== index);
    setValue("images", updatedImages);
  };

  useEffect(() => {
    if (user) {
      var getBusinessInfo = async () => {
        var res = await mainService.post<GetBusinessResponseModel>(`Businesses/GetBusinessByUserId`, { userId: user.id });
        if (res.status === 200 && res.data) {
          setValue("id", res.data.id)
          setValue("category", res.data.category);
          setValue("name", res.data.name);
          setValue("phoneNumber", res.data.phoneNumber);
          setValue("location.latitude", parseFloat(res.data.latitude));
          setValue("location.longitude", parseFloat(res.data.longitude));
          setValue("city", res.data.city);
          setValue("district", res.data.district);
          setValue("address", res.data.address);
          setValue("images", res.data.imageUrls);
          setValue("workingHours", res.data.workingHours)
          setValue("isConfirmed", res.data.isConfirmed);
        }
      }

      getBusinessInfo();
    }
  }, [user])

  const disabled = watch("id") > 0 && !watch("isConfirmed");

  return (
    <ScrollView style={styles.container}>
      <HeaderPage title="İşletme Kaydet" />
      <View className="flex flex-1 flex-col bg-white p-4 gap-5 rounded-t-3xl shadow-black pb-24">
        {disabled && (<Text className="text-center text-rose-500 font-bold">İşletmeniz Onay Beklemektedir</Text>)}
        <AppDropdownPicker
          defaultValue={watch("category")}
          data={categories}
          onSelect={(value) => {
            setValue("category", value);
          }}
          placeholder="Kategori Seçiniz"
          isRequired
          requiredMessage={errors.category?.message}
          disabled={disabled}
        />

        <CustomInput
          control={control}
          name="name"
          placeholder="İşletme Adı"
          disabled={disabled}
        />

        <CustomInput
          control={control}
          name="phoneNumber"
          placeholder="İşletme Telefon Numarası"
          isPhoneNumber
          disabled={disabled}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="city"
              placeholder="İl"
              disabled={disabled}
            />
          </View>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="district"
              placeholder="İlçe"
              disabled={disabled}
            />
          </View>
        </View>

        <CustomInput
          control={control}
          name="address"
          placeholder="Adress"
          isPhoneNumber
          disabled={disabled}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="location.latitude"
              placeholder="Latitude"
              disabled={disabled}
            />
          </View>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="location.longitude"
              placeholder="Longitude"
              disabled={disabled}
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowLocationModal(true)} disabled={disabled}>
          <Text className="text-rose-500 underline">Konum bilgisini haritadan seçmek için tıklayınız</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Çalışma Saatleri</Text>
          <View style={{ borderWidth: 1, padding: 5, borderColor: "#cecece", borderRadius: 10 }}>
            <WorkingHoursSelector
              control={control}
              name="workingHours"
              disabled={disabled}
            />
          </View>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <MaterialCommunityIcons name="file-image-plus" size={30} color="orange" onPress={selectImage} disabled={disabled} />
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>İşletme İçin Fotoğraf Ekleyin</Text>

          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{
                position: "relative",
              }}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 100,
                    height: 50,
                  }}
                  resizeMode="contain"
                />
                <FontAwesome
                  name="times-circle-o"
                  color="red"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 15,
                  }}
                  size={24}
                  disabled={disabled}
                  onPress={() => removeImage(index)}
                />
              </View>
            )}
          />
          {errors.images?.message && <Text className="font-bold text-rose-500">{errors.images?.message}</Text>}
        </View>


        <CustomButton text="Kaydet" onPress={handleSubmit(onSubmit)} bgColor="red" disabled={disabled} />

      </View>

      <Modal visible={showLocationModal} animationType="slide" onRequestClose={() => setShowLocationModal(false)}>
        <SelectLocation
          onSelectLocation={(category: string, name: string, latitude: number, longitude: number, city: string, district: string, address: string, phoneNumber: string, images: string[], workingHours: { workingDay: number, value: string }[]) => {
            setValue("location.latitude", latitude);
            setValue("location.longitude", longitude);
            setValue("address", address);
            setValue("city", city);
            setValue("district", district);
            setValue("phoneNumber", phoneNumber);
            setValue("images", images)
            setValue("name", name)
            setValue("category", category);
            setValue("workingHours", workingHours);
            setShowLocationModal(false);
          }}
          onClose={() => setShowLocationModal(false)}
        />
      </Modal>
    </ScrollView>
  )
}
export default NewHairdressersPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});