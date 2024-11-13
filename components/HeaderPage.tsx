import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    View,
    Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderPageProps {
    title: string;
}

const HeaderPage: React.FC<HeaderPageProps> = (props) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <View
            style={[
                {
                    paddingTop: insets.top + 20,
                    padding: 20,
                },
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <Text style={{ fontFamily: "Poppins_600SemiBold", color: "#000" }}>
                    {props.title}
                </Text>
                <FontAwesome
                    name="chevron-left"
                    size={20}
                    onPress={() => router.back()}
                    style={{ position: "absolute", left: 0 }}
                />
            </View>
        </View>
    )
}
export default HeaderPage;