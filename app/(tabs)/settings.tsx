import Header from "@/components/Header";
import { Switch } from "@/components/Switch";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Appearance, TouchableOpacity } from "react-native";

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Header showLogo />
      <View className="flex flex-col p-6 space-y-6">
        <View className="flex-row justify-between">
          <Text className="">Dark Modu</Text>
          <Switch
            value={Appearance.getColorScheme() === "dark"}
            onValueChange={(value) =>
              Appearance.setColorScheme(value ? "dark" : "light")
            }
          />
        </View>

        <TouchableOpacity
          className="flex-row justify-between mt-4 border p-2 shadow bg-white"
          onPress={() => router.push("/new-hairdressers")}
        >
          <Text className="">İşletme Kaydet</Text>
          <FontAwesome5 name="chevron-right" size={20} />
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
