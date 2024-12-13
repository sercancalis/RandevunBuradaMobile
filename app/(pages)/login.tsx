import CustomInput from "@/components/CustomInput";
import OrComponent from "@/components/OrComponent";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { loginSchema } from "@/schema/loginSchema";
import { useClerk, useOAuth, useSignIn, useUser } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from "react-native";
import { z } from "zod";
import Toast from "react-native-toast-message";

interface LoginProps {

}

enum Strategy {
    Google = "oauth_google",
    Apple = "oauth_apple",
    Facebook = "oauth_facebook",
}

const { height } = Dimensions.get("screen");
const Login: React.FC<LoginProps> = (props) => {
    useWarmUpBrowser();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { user } = useUser();
    const router = useRouter();
    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
    const { startOAuthFlow: facebookAuth } = useOAuth({
        strategy: "oauth_facebook",
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {

        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [isPhone, setIsPhone] = useState(false);

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
            } else {
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    };

    const onSignInPress = async () => {
        if (!watch("input"))
            return Toast.show({
                type: "error",
                text1: isPhone
                    ? "Lütfen telefon numarası giriniz"
                    : "Lütfen email ya da kullanıcı adı giriniz",
                position: "bottom"
            })
        if (!isLoaded) {
            return;
        }
        try {
            var res = await signIn.create({
                identifier: watch("input"),
            });
            if (res.status === "needs_first_factor") setShowSecondModal(true);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Hesabınızı sistemde bulamadık. Lütfen kayıt olunuz.",
                position: "bottom"
            })
        }
    };

    const loginAction = async () => {
        if (!watch("password"))
            return Toast.show({
                type: "error",
                text1: "Lütfen şifre giriniz.",
                position: "bottom"
            })
        if (!isLoaded) {
            return;
        }
        try {
            const signInAttempt = await signIn.attemptFirstFactor({
                password: watch("password"),
                strategy: "password",
            });
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                Toast.show({
                    type: "success",
                    text1: "Giriş başarılı anasayfaya yönlendiriliyorsunuz",
                    position: "bottom"
                })
                router.push("/")
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: isPhone
                    ? "Telefon bilginiz ile şifreniz eşleşmemektedir."
                    : "Email ya da Kullanıcı Adı ile şifreniz eşleşmemektedir.",
                position: "bottom"
            })
        }
    };


    const reset = () => {
        setShowSecondModal(false);
        setValue("input", "")
        setShowPassword(false);
    }

    return (
        <View style={styles.container}>
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

                        <View style={{ marginVertical: 40 }}>
                            <OrComponent />
                        </View>

                        <View style={{ marginBottom: 30 }}>
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
                                <CustomInput
                                    control={control}
                                    name="input"
                                    placeholder={isPhone ? "(555) 555 55 55" : ""}
                                    isPhoneNumber={isPhone}
                                    keyboardType={isPhone ? "phone-pad" : "email-address"}
                                />
                            </View>
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
                                        marginBottom: 20
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
                                    {watch("input")}
                                </Text>
                                <AntDesign
                                    name="edit"
                                    size={20}
                                    color={"blue"}
                                    onPress={reset}
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 30 }}>
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
                                <CustomInput
                                    control={control}
                                    name="password"
                                    secureTextEntry={!showPassword}
                                />
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    style={{ position: "absolute", right: 10, top: 10 }}
                                    size={24}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            </View>
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
        </View>
    )
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
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