import { FontAwesome5 } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function PagesLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="new-hairdressers" options={{ headerShown: false }} />
      <Stack.Screen name="list-hairdressers" options={{ headerShown: false }} />
      <Stack.Screen name="appointment" options={{ headerShown: false }} />
      <Stack.Screen
        name="hairdressers-detail"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerStyle: { backgroundColor: "transparent" },
          headerShown: true,
          headerTitle: "Kayıt Ol",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome5 name="chevron-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerStyle: { backgroundColor: "transparent" },
          headerShown: true,
          headerTitle: "Giriş Yap",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome5 name="chevron-left" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="employees" options={{ headerShown: false }} />
    </Stack>
  );
}
