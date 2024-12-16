import OrComponent from "@/components/OrComponent";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import AppOtpInput, { AppOtpInputHandle } from "@/components/AppOtpInput";
import { useRouter } from "expo-router";
import CustomInput from "@/components/CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/schema/registerSchema";
import { mainService } from "@/utils/axiosInstance";
import Toast from "react-native-toast-message";

interface RegisterPageProps { }

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const RegisterPage: React.FC<RegisterPageProps> = (props) => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
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
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "sercan",
      lastName: "çalış",
      username: "scalis37",
      emailAddress: "sercancalis7@gmail.com",
      password: "Sercan1+",
      phoneNumber: "(538) 287 43 06"
    }
  });

  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [otp, setOtp] = useState("");
  const [showSmsVerify, setShowSmsVerify] = useState(false);
  const otpInputRef = useRef<AppOtpInputHandle>(null);
  const handleClearOtp = () => {
    otpInputRef.current?.clearOtp(); // `clearOtp` metodu çağrılıyor
  };

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive, authSessionResult } = await selectedAuth();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      const error = JSON.parse(JSON.stringify(err, null, 2));
      console.error("OAuth error", error);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof registerSchema>> = async (data: z.infer<typeof registerSchema>) => {
    if (
      !isLoaded
    ) {
      return;
    }

    try {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        password: data.password,
        phoneNumber: "+90" + data.phoneNumber,
        username: data.username,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setShowVerifyCode(true);
    } catch (err: any) {
      const error = JSON.parse(JSON.stringify(err, null, 2));
      if (error.errors) {
        error.errors.forEach((e: any) => {
          Toast.show({
            type: "error",
            text1: e.message,
            position: "bottom"
          })
        });
      }
    }
  };


  const onValidate = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptVerification({
        strategy: showSmsVerify ? "phone_code" : "email_code",
        code: otp,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        var model = {
          userId: completeSignUp.createdUserId,
          role: "user"
        };
        await mainService.post("Users/UpdateRole", model)
        router.replace("/");
      } else {
        await signUp.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
        setShowSmsVerify(true);
        handleClearOtp();
      }
    } catch (err: any) {
      console.log(444, JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView style={styles.container}>
      {!showVerifyCode ? (
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

          <View style={{ marginVertical: 30 }}>
            <OrComponent />
          </View>
          <View style={{ flexDirection: "column", gap: 20, }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <CustomInput
                title={"İsim"}
                control={control}
                name={"firstName"}
              />
              <CustomInput
                title={"Soyisim"}
                control={control}
                name={"lastName"}
              />
            </View>
            <CustomInput
              title={"Kullanıcı Adı"}
              control={control}
              name={"username"}
            />
            <CustomInput
              title={"Email"}
              control={control}
              name={"emailAddress"}
              keyboardType="email-address"
            />
            <CustomInput
              title={"Şifre"}
              control={control}
              name={"password"}
              secureTextEntry
            />

            <CustomInput
              title={"Telefon Numarası"}
              control={control}
              name={"phoneNumber"}
              keyboardType="phone-pad"
              isPhoneNumber
            />

            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
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
                    marginTop: 40
                  },
                ]}
              >
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "gray",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              backgroundColor: "white",
              gap: 5,
            }}
          >
            <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
              {`${showSmsVerify ? "Telefonunuzu" : "Emailinizi"} doğrulayın`}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 12,
              }}
            >
              {`${showSmsVerify ? "Telefonunuza" : "Email adresinize"
                } gelen doğrulama kodunu giriniz`}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 12,
                }}
              >
                {showSmsVerify ? watch("phoneNumber") : watch("emailAddress")}
              </Text>

              <AntDesign
                name="edit"
                size={20}
                color={"blue"}
                onPress={() => {
                  setShowVerifyCode(false);
                  setShowSmsVerify(false);
                }}
              />
            </View>
            <View style={{ marginTop: 30 }}>
              <AppOtpInput setValue={setOtp} ref={otpInputRef} />
            </View>
            <TouchableOpacity
              style={{ width: "100%", marginVertical: 10 }}
              onPress={onValidate}
              disabled={otp.length < 6}
            >
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
                Doğrula
              </Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )}
    </ScrollView>
  );
};
export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    gap: 40,
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
    minHeight: 40,
    maxHeight: 40,
  },
  btnText: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
