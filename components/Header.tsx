import { Colors } from "@/constants/Colors";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  showLogo?: boolean;
  hideShadow?: boolean;
  showBackButton?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const theme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("screen");
  const router = useRouter();
  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          backgroundColor:
            theme === "light" ? Colors.light.white : Colors.dark.white,
          paddingHorizontal: 20,
        },
        !props.hideShadow && {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        <View>
          {props.showBackButton && (
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View>
          {props.showLogo && (
            <Image
              source={require("@/assets/images/randevu_burada_logo.png")}
              alt="Logo Icon"
              style={{
                width: width / 2,
                height: 50,
              }}
            />
          )}
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {},
});
