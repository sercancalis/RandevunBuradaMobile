import AppButton from "@/components/AppButton";
import Header from "@/components/Header";
import MyCalendar from "@/components/MyCalendar";
import OrComponent from "@/components/OrComponent";
import { ThemedView } from "@/components/ThemedView";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useClerk, useOAuth, useSignIn, useUser } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface AppointmentPageProps { }

enum Strategy {
    Google = "oauth_google",
    Apple = "oauth_apple",
    Facebook = "oauth_facebook",
}

const { height } = Dimensions.get("screen");
const AppointmentPage: React.FC<AppointmentPageProps> = (props) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    useWarmUpBrowser();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { signOut } = useClerk();
    const { user } = useUser();
    const router = useRouter();
    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
    const { startOAuthFlow: facebookAuth } = useOAuth({
        strategy: "oauth_facebook",
    });

    const [input, setInput] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [error, setError] = useState("");
    const [showSecondModal, setShowSecondModal] = useState(false);

    const onSelectAuth = async (strategy: Strategy) => {
        const selectedAuth = {
            [Strategy.Google]: googleAuth,
            [Strategy.Apple]: appleAuth,
            [Strategy.Facebook]: facebookAuth,
        }[strategy];

        try {
            const { createdSessionId, setActive } = await selectedAuth();
            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                bottomSheetModalRef.current?.close();
            } else {
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    };

    const submit = () => {
        reset();
        if (!user) return handlePresentModalPress();
    };

    const onSignInPress = async () => {
        setError("");
        if (!input)
            return setError(
                isPhone
                    ? "Lütfen telefon numarası giriniz"
                    : "Lütfen email ya da kullanıcı adı giriniz"
            );
        if (!isLoaded) {
            return;
        }
        try {
            var res = await signIn.create({
                identifier: input,
            });
            if (res.status === "needs_first_factor") setShowSecondModal(true);
        } catch (error) {
            setError("Hesabınızı sistemde bulamadık. Lütfen kayıt olunuz.");
        }
    };

    const loginAction = async () => {
        if (!password) return setError("Lütfen şifre giriniz");
        if (!isLoaded) {
            return;
        }
        try {
            const signInAttempt = await signIn.attemptFirstFactor({
                password: password,
                strategy: "password",
            });
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                bottomSheetModalRef.current?.close();
            }
        } catch (error) {
            setError(
                isPhone
                    ? "Telefon bilginiz ile şifreniz eşleşmemektedir."
                    : "Email ya da Kullanıcı Adı ile şifreniz eşleşmemektedir."
            );
        }
    };

    const reset = () => {
        setShowSecondModal(false);
        setInput("");
        setPassword("");
        setError("");
        setShowPassword(false);
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                bottomSheetModalRef.current?.close();
            }}
        >
            <ThemedView style={styles.container}>
                <GestureHandlerRootView>
                    <BottomSheetModalProvider>
                        <Header showLogo />
                        <MyCalendar />

                        <AppButton title="Randevu" onPress={submit} />
                        {user !== null && <AppButton title="Çıkış" onPress={signOut} />}

                        <BottomSheetModal ref={bottomSheetModalRef}>
                            <BottomSheetView style={styles.contentContainer}>
                                <View style={styles.container}>
                                    {!showSecondModal ? (
                                        <React.Fragment>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={styles.btnOutline}
                                                    onPress={() => onSelectAuth(Strategy.Apple)}
                                                >
                                                    <Ionicons name="logo-apple" size={24} />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.btnOutline}
                                                    onPress={() => onSelectAuth(Strategy.Google)}
                                                >
                                                    <Image
                                                        source={require("@/assets/images/googleIcon.png")}
                                                        resizeMode="contain"
                                                        style={{ aspectRatio: 1, height: 24 }}
                                                    />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.btnOutline}
                                                    onPress={() => onSelectAuth(Strategy.Facebook)}
                                                >
                                                    <Image
                                                        source={require("@/assets/images/facebookIcon.png")}
                                                        resizeMode="contain"
                                                        style={{ aspectRatio: 1, height: 24 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <OrComponent />

                                            <View style={{}}>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
                                                        {isPhone
                                                            ? "Telefon Numarası"
                                                            : "Email ya da Kullanıcı Adı"}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            textDecorationLine: "underline",
                                                            color: "blue",
                                                            fontFamily: "Poppins_600SemiBold",
                                                        }}
                                                        onPress={() => setIsPhone(!isPhone)}
                                                    >
                                                        {isPhone
                                                            ? "Email ya da Kullanıcı Adı"
                                                            : "Telefon İle"}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 10,
                                                    }}
                                                >
                                                    {isPhone && (
                                                        <Text
                                                            style={{
                                                                fontFamily: "Poppins_600SemiBold",
                                                                borderWidth: 1,
                                                                padding: 10,
                                                                borderColor: "#ABABAB",
                                                                borderRadius: 8,
                                                            }}
                                                        >
                                                            +90
                                                        </Text>
                                                    )}
                                                    <TextInput
                                                        autoCapitalize="none"
                                                        value={input}
                                                        style={[styles.inputField]}
                                                        onChangeText={(e) => {
                                                            setInput(e);
                                                            if (e) setError("");
                                                        }}
                                                    />
                                                </View>
                                                {error && (
                                                    <Text
                                                        style={{
                                                            fontFamily: "Poppins_600SemiBold",
                                                            color: "red",
                                                            fontSize: 10,
                                                        }}
                                                    >
                                                        {error}
                                                    </Text>
                                                )}
                                            </View>
                                            <TouchableOpacity onPress={onSignInPress}>
                                                <Text
                                                    style={[
                                                        styles.btnText,
                                                        {
                                                            backgroundColor: "black",
                                                            color: "white",
                                                            padding: 5,
                                                            textDecorationLine: "none",
                                                            borderWidth: 1,
                                                            borderRadius: 10,
                                                        },
                                                    ]}
                                                >
                                                    Devam Et
                                                </Text>
                                            </TouchableOpacity>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 5,
                                                }}
                                            >
                                                <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
                                                    Hesabın yok mu ?
                                                </Text>
                                                <Text
                                                    style={[styles.btnText, { color: "blue" }]}
                                                    onPress={() => {
                                                        router.push("/(pages)/register");
                                                        bottomSheetModalRef.current?.close();
                                                    }}
                                                >
                                                    Kayıt Ol
                                                </Text>
                                            </View>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <Text
                                                style={{
                                                    fontFamily: "Poppins_700Bold",
                                                    textAlign: "center",
                                                    fontSize: 18,
                                                }}
                                            >
                                                Şifre Giriniz
                                            </Text>
                                            <View>
                                                <Text
                                                    style={{
                                                        fontFamily: "Poppins_500Medium",
                                                        textAlign: "center",
                                                        color: "gray",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Hesabınızla ilişkili şifreyi giriniz
                                                </Text>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 10,
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: "Poppins_600SemiBold",
                                                            color: "gray",
                                                            fontSize: 14,
                                                        }}
                                                    >
                                                        {input}
                                                    </Text>
                                                    <AntDesign
                                                        name="edit"
                                                        size={20}
                                                        color={"blue"}
                                                        onPress={reset}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{}}>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    <Text style={{ fontFamily: "Poppins_600SemiBold" }}>
                                                        Şifre
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "blue",
                                                            fontFamily: "Poppins_600SemiBold",
                                                        }}
                                                    >
                                                        Şifremi Unuttum
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 10,
                                                    }}
                                                >
                                                    <TextInput
                                                        autoCapitalize="none"
                                                        value={password}
                                                        style={[styles.inputField]}
                                                        onChangeText={(e) => {
                                                            setPassword(e);
                                                            if (e) setError("");
                                                        }}
                                                        secureTextEntry={!showPassword}
                                                    />
                                                    <Ionicons
                                                        name={showPassword ? "eye-off" : "eye"}
                                                        style={{ position: "absolute", right: 10, top: 10 }}
                                                        size={24}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                    />
                                                </View>
                                                {error && (
                                                    <Text
                                                        style={{
                                                            fontFamily: "Poppins_600SemiBold",
                                                            color: "red",
                                                            fontSize: 10,
                                                        }}
                                                    >
                                                        {error}
                                                    </Text>
                                                )}
                                            </View>
                                            <TouchableOpacity onPress={loginAction}>
                                                <Text
                                                    style={[
                                                        styles.btnText,
                                                        {
                                                            backgroundColor: "black",
                                                            color: "white",
                                                            padding: 5,
                                                            textDecorationLine: "none",
                                                            borderWidth: 1,
                                                            borderRadius: 10,
                                                        },
                                                    ]}
                                                >
                                                    Giriş Yap
                                                </Text>
                                            </TouchableOpacity>
                                        </React.Fragment>
                                    )}
                                </View>
                            </BottomSheetView>
                        </BottomSheetModal>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </ThemedView>
        </TouchableWithoutFeedback>
    );
};
export default AppointmentPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        gap: 15,
    },
    contentContainer: {
        height: height / 3,
        padding: 20,
    },

    btnOutline: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        borderColor: "#cecece",
    },
    inputField: {
        position: "relative",
        borderWidth: 1,
        borderColor: "#ABABAB",
        borderRadius: 8,
        padding: 10,
        lineHeight: 20,
        flex: 1,
        fontFamily: "Poppins_500Medium",
    },
    btn: {
        backgroundColor: "black",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        textAlign: "center",
        textDecorationLine: "underline",
        color: "#000",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },
    footer: {
        position: "absolute",
        height: 100,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopColor: "#cecece",
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
