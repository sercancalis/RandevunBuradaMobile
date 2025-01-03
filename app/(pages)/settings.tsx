import Header from "@/components/Header";
import { Switch } from "@/components/Switch";
import { mainService } from "@/utils/axiosInstance";
import { checkRole } from "@/utils/roles";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Appearance, TouchableOpacity } from "react-native";

interface SettingsPageProps { }

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Header showLogo showBackButton showNotificationIcon />
      <View className="flex flex-col p-6 space-y-6">
        <View className="flex-row items-center justify-between">
          <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Dark Modu</Text>
          <Switch
            disabled
            value={Appearance.getColorScheme() === "dark"}
            onValueChange={(value) =>
              Appearance.setColorScheme(value ? "dark" : "light")
            }
          />
        </View>


        <TouchableOpacity
          className="flex-row justify-between mt-4 p-4 shadow bg-white rounded-lg"
          onPress={() => router.push("/new-hairdressers")}
        >
          <Text style={{ fontFamily: "Poppins_500Medium" }}>İşletmemi Kaydet</Text>
          <FontAwesome5 name="chevron-right" size={20} />
        </TouchableOpacity>

        {checkRole(user, "boss") && (
          <React.Fragment>
            <TouchableOpacity
              className="flex-row justify-between mt-4 p-4 shadow bg-white rounded-lg"
              onPress={() => router.push("/employees")}
            >
              <Text style={{ fontFamily: "Poppins_500Medium" }}>Personel Kaydet</Text>
              <FontAwesome5 name="chevron-right" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row justify-between mt-4 p-4 shadow bg-white rounded-lg"
              onPress={() => router.push("/services")}
            >
              <Text style={{ fontFamily: "Poppins_500Medium" }}>Hizmet Kaydet</Text>
              <FontAwesome5 name="chevron-right" size={20} />
            </TouchableOpacity>
          </React.Fragment>
        )}

        <TouchableOpacity
          className="flex-row justify-between mt-4 p-4 shadow bg-white rounded-lg"
          onPress={() => {
            signOut();
            router.replace("/")
          }}
        >
          <Text style={{ fontFamily: "Poppins_500Medium" }}>Çıkış</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
