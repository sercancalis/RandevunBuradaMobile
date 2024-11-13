import CustomInput from "@/components/CustomInput";
import HeaderPage from "@/components/HeaderPage";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/components/CustomButton";
import WorkingHoursSelector from "@/components/WorkingHoursSelector";
import SelectLocation from "@/components/SelectLocation";

interface NewHairdressersPageProps {

}

const schema = z.object({
  businessName: z
    .string({ required_error: "Lütfen işletme adını giriniz" })
    .min(5, { message: "İşletme adı min 5 karakter olabilir." })
    .max(30, { message: "İşletme adı max 30 karakter olabilir." }),
  phoneNumber: z.string({ required_error: "Lütfen işletme telefon numarasını giriniz" }),
  workingHours: z.array(
    z.object({
      day: z.number(),
      value: z.string()
    })),
  location: z.object({
    latitude: z.number({ required_error: "Lütfen konum bilgisi seçiniz" }),
    longitude: z.number({ required_error: "Lütfen konum bilgisi seçiniz" }),
  }),
  formattedAddress: z.string({ required_error: "Lütfen adres bilgisi seçiniz" })
});

type FormType = z.infer<typeof schema>;

const NewHairdressersPage: React.FC<NewHairdressersPageProps> = (props) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      workingHours: [
        { day: 0, value: "09:00-17:00" },
        { day: 1, value: "09:00-17:00" },
        { day: 2, value: "09:00-17:00" },
        { day: 3, value: "09:00-17:00" },
        { day: 4, value: "09:00-17:00" },
        { day: 5, value: "09:00-17:00" },
        { day: 6, value: "Kapalı" },
      ]
    }
  });

  console.log(123, watch())

  const onSubmit: SubmitHandler<FormType> = (data: FormType) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <HeaderPage title="İşletme Kaydet" />
      <View className="flex flex-col h-screen bg-white p-4 gap-5 rounded-t-3xl shadow-black">
        <CustomInput
          control={control}
          name="businessName"
          placeholder="İşletme Adı"
        />

        <CustomInput
          control={control}
          name="phoneNumber"
          placeholder="İşletme Telefon Numarası"
          isPhoneNumber
        />

        <CustomInput
          control={control}
          name="formattedAddress"
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

        <CustomButton text="Kaydet" onPress={handleSubmit(onSubmit)} bgColor="red" />

      </View>

      <Modal visible={showLocationModal} animationType="slide" onRequestClose={() => setShowLocationModal(false)}>
        <SelectLocation
          onSelectLocation={(latitude: number, longitude: number, address: string) => { 
            setValue("location.latitude", latitude);
            setValue("location.longitude", longitude);
            setValue("formattedAddress", address);
            trigger();
            setShowLocationModal(false);
          }}
          onClose={() => setShowLocationModal(false)}
        />
      </Modal>
    </View>
  )
}
export default NewHairdressersPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});