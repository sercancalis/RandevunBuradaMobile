import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import PhoneInput from "react-native-phone-number-input";

interface CustomPhoneNumberInputType {
  value: string;
  onChangeText: (value: string) => void;
  setIsValidPhoneNumber: React.Dispatch<React.SetStateAction<boolean>>;
  isValidateControl: boolean;
}
const CustomPhoneNumberInput: React.FC<CustomPhoneNumberInputType> = (
  props
) => {
  const phoneInput = useRef<PhoneInput>(null);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Telefon Numarası <Text style={{ color: "red" }}>*</Text>
      </Text>
      <PhoneInput
        ref={phoneInput}
        defaultValue={props.value}
        defaultCode="TR"
        layout="first"
        onChangeFormattedText={(val) => {
          props.onChangeText(val);
          props.setIsValidPhoneNumber(
            phoneInput.current?.isValidNumber(val) ?? false
          );
        }}
        containerStyle={[
          styles.phoneContainer,
          {
            borderColor:
              !phoneInput.current?.isValidNumber(props.value) &&
              props.isValidateControl
                ? "red"
                : "#ABABAB",
          },
        ]}
        textContainerStyle={styles.phoneTextContainer}
        codeTextStyle={styles.phoneCodeText}
        textInputStyle={styles.phoneTextInput}
        placeholder=" "
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontFamily: "Poppins_500Medium",
  },
  phoneContainer: {
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    height: 40,
  },
  phoneTextContainer: {
    borderRadius: 8,
  },
  phoneCodeText: {
    fontSize: 16,
    padding: 0,
    height: 40,
    lineHeight: 40,
  },
  phoneTextInput: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    height: 40,
    lineHeight: 20,
  },
});

export default CustomPhoneNumberInput;
