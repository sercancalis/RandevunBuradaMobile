import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";

interface AppOtpInputProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface AppOtpInputHandle {
  clearOtp: () => void;
}

const AppOtpInput = forwardRef<AppOtpInputHandle, AppOtpInputProps>((props, ref) => {

  const otpInputRef = useRef<OtpInputRef>(null);

  // `useImperativeHandle` ile dışarıya metotlar açıyoruz
  useImperativeHandle(ref, () => ({
    clearOtp: () => {
      if (otpInputRef.current) {
        otpInputRef.current.clear();
      }
    },
  }));

  return (
    <OtpInput
      ref={otpInputRef}
      numberOfDigits={6}
      focusColor="blue"
      focusStickBlinkingDuration={500}
      onTextChange={props.setValue}
      onFilled={(text) => Keyboard.dismiss()}
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
});

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
