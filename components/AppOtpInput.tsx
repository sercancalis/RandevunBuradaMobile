import React from "react";
import { StyleSheet } from "react-native";
import { OtpInput } from "react-native-otp-entry";

interface AppOtpInputProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  ref: React.MutableRefObject<null>;
}

const AppOtpInput: React.FC<AppOtpInputProps> = (props) => {
  return (
    <OtpInput
      ref={props.ref}
      numberOfDigits={6}
      focusColor="blue"
      focusStickBlinkingDuration={500}
      onTextChange={props.setValue}
      onFilled={(text) => console.log(`OTP is ${text}`)}
      textInputProps={{
        accessibilityLabel: "One-Time Password",
      }}
      theme={{
        containerStyle: styles.container,
        pinCodeContainerStyle: styles.pinCodeContainer,
        pinCodeTextStyle: styles.pinCodeText,
      }}
    />
  );
};
export default AppOtpInput;

const styles = StyleSheet.create({
  container: {},
  pinCodeContainer: {
    height: 45,
  },
  pinCodeText: {
    fontSize: 20,
  },
});
