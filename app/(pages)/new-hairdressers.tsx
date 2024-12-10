import CustomInput from "@/components/CustomInput";
import HeaderPage from "@/components/HeaderPage";
import React, { useState } from "react";
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
  TextInput
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
import ServicesSelector from "@/components/ServicesSelector";

interface NewHairdressersPageProps {

}

const schema = z.object({
  category: z.string({ required_error: "Lütfen kategori seçiniz" }),
  name: z
    .string({ required_error: "Lütfen işletme adını giriniz" })
    .min(5, { message: "İşletme adı min 5 karakter olabilir." })
    .max(30, { message: "İşletme adı max 30 karakter olabilir." }),
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
  services: z.array(
    z.string({
      required_error: "Lütfen hizmet giriniz",
    }).min(3, { message: "Hizmet adı en az 3 karakter olmalı" }) // Her hizmet için 3 karakterden fazla olmalı
  )
    .min(1, { message: "Lütfen min 1 adet hizmet ekleyiniz" })
});

type FormType = z.infer<typeof schema>;

const NewHairdressersPage: React.FC<NewHairdressersPageProps> = (props) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormType>({
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
      setValue("images", [...images, result.assets[0].uri]);
    }
  }

  async function uriToBlob(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {

    try {
      var formData = new FormData();
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

      const imageBlobs = await Promise.all(images.map(uriToBlob));

      imageBlobs.forEach((blob, index) => {
        formData.append('Images', blob, `image${index}.jpg`);
      });

      var res = await addBusinessService(formData);
    } catch (error) {
    }
  };

  const images = watch("images") || [];
  const removeImage = (index: number) => {
    const updatedImages = watch("images").filter((_, i) => i !== index);
    setValue("images", updatedImages);
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderPage title="İşletme Kaydet" />
      <View className="flex flex-1 flex-col bg-white p-4 gap-5 rounded-t-3xl shadow-black pb-24">

        <AppDropdownPicker
          defaultValue={watch("category")}
          data={categories}
          onSelect={(value) => {
            setValue("category", value);
          }}
          placeholder="Kategori Seçiniz"
          isRequired
          requiredMessage={errors.category?.message}
        />

        <CustomInput
          control={control}
          name="name"
          placeholder="İşletme Adı"
        />

        <CustomInput
          control={control}
          name="phoneNumber"
          placeholder="İşletme Telefon Numarası"
          isPhoneNumber
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="city"
              placeholder="İl"
            />
          </View>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="district"
              placeholder="İlçe"
            />
          </View>
        </View>

        <CustomInput
          control={control}
          name="address"
          placeholder="Adress"
          isPhoneNumber
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="location.latitude"
              placeholder="Latitude"
            />
          </View>
          <View className="w-1/2">
            <CustomInput
              control={control}
              name="location.longitude"
              placeholder="Longitude"
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowLocationModal(true)}>
          <Text className="text-rose-500 underline">Konum bilgisini haritadan seçmek için tıklayınız</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Çalışma Saatleri</Text>
          <View style={{ borderWidth: 1, padding: 5, borderColor: "#cecece", borderRadius: 10 }}>
            <WorkingHoursSelector
              control={control}
              name="workingHours"
            />
          </View>
        </View>

        <View>
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Hizmetler</Text>
          <View style={{ borderWidth: 1, padding: 5, borderColor: "#cecece", borderRadius: 10 }}>
            <ServicesSelector
              control={control}
              name="services"
              error={Array.isArray(errors?.services) ? errors.services.map((error: any) => error.message).join(', ') : ''}
            />
          </View>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <MaterialCommunityIcons name="file-image-plus" size={30} color="orange" onPress={selectImage} />
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
                  onPress={() => removeImage(index)}
                />
              </View>
            )}
          />
          {errors.images?.message && <Text className="font-bold text-rose-500">{errors.images?.message}</Text>}
        </View>


        <CustomButton text="Kaydet" onPress={handleSubmit(onSubmit)} bgColor="red" />

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