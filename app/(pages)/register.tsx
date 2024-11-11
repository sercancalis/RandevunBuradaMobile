import CustomPhoneNumberInput from "@/components/CustomPhoneNumberInput";
import OrComponent from "@/components/OrComponent";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import AppInput from "@/components/AppInput";
import AppOtpInput from "@/components/AppOtpInput";
import { useRouter } from "expo-router";

interface RegisterPageProps {}

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

  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
  });
  const [isValidateControl, setIsValidateControl] = useState(false);
  const [showSmsVerify, setShowSmsVerify] = useState(true);
  const otpInputRef = useRef(null);

  const clearOtp = () => {
    if (otpInputRef.current) {
      //@ts-ignore
      otpInputRef.current.clear();
    }
    setOtp("");
  };

  const onChangeText = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const onSignUpPress = async () => {
    setIsValidateControl(true);
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      phoneNumber,
      username,
    } = form;
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !password ||
      !phoneNumber ||
      !username ||
      !isValidPhoneNumber ||
      username?.length < 4 ||
      password?.length < 8 ||
      !isLoaded
    ) {
      return;
    }

    try {
      await signUp.create({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
        phoneNumber: phoneNumber,
        username: username,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setShowVerifyCode(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      const error = JSON.parse(JSON.stringify(err, null, 2));
      if (error.errors) {
        error.errors.forEach((e: any) => {
          if (e.code === "form_identifier_exists") {
            if (e.meta.paramName === "email_address") {
              alert("This email address is already taken.");
            }
            if (e.meta.paramName === "username") {
              alert("This username is already taken.");
            }
          }
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
        router.replace("/");
      } else {
        await signUp.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
        setShowSmsVerify(true);
        clearOtp();
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.log(444);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
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

          <OrComponent />

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <AppInput
              title={"İsim"}
              value={form.firstName}
              onChangeText={(value) => onChangeText("firstName", value)}
              isRequired
              isValidateControl={isValidateControl}
            />
            <AppInput
              title={"Soyisim"}
              value={form.lastName}
              onChangeText={(value) => onChangeText("lastName", value)}
              isRequired
              isValidateControl={isValidateControl}
            />
          </View>
          <AppInput
            title={"Kullanıcı Adı"}
            value={form.username}
            onChangeText={(value) => onChangeText("username", value)}
            isRequired
            maxLength={4}
            isValidateControl={isValidateControl}
          />
          <AppInput
            title={"Email"}
            value={form.emailAddress}
            onChangeText={(value) => onChangeText("emailAddress", value)}
            isRequired
            keyboardType="email-address"
            isValidateControl={isValidateControl}
          />
          <AppInput
            title={"Şifre"}
            value={form.password}
            onChangeText={(value) => onChangeText("password", value)}
            isRequired
            isSecureText
            maxLength={8}
            isValidateControl={isValidateControl}
          />
          <CustomPhoneNumberInput
            value={form.phoneNumber}
            onChangeText={(value) => onChangeText("phoneNumber", value)}
            setIsValidPhoneNumber={setIsValidPhoneNumber}
            isValidateControl={isValidateControl}
          />

          <TouchableOpacity onPress={onSignUpPress}>
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
              Kayıt Ol
            </Text>
          </TouchableOpacity>
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
            {!showSmsVerify ? (
              <React.Fragment></React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
              {`${showSmsVerify ? "Telefonunuzu" : "Emailinizi"} doğrulayın`}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 12,
              }}
            >
              {`${
                showSmsVerify ? "Telefonunuza" : "Email adresinize"
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
                {showSmsVerify ? form.phoneNumber : form.emailAddress}
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
    </View>
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
