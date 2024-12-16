import { Colors } from "@/constants/Colors";
import { useSession } from "@clerk/clerk-expo";
import { Entypo, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const { session } = useSession();
  return (
    <View
      style={[
        {
          position: "relative",
          paddingTop: insets.top,
          backgroundColor:
            theme === "light" ? Colors.light.white : Colors.dark.white,
          paddingHorizontal: 20,
          zIndex: 999
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
                marginLeft: 25
              }}
            />
          )}
          {props.title && (
            <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16, marginLeft: 25 }}>{props.title}</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, width: 50 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          {/* <Ionicons name="settings" size={24} color="black" onPress={() => router.push("/settings")} /> */}
          <FontAwesome name="user-circle-o" size={24} color="black" onPress={() => router.push(session ? "/settings" : "/login")} />
        </View>
      </View>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {},
});
