import { FontAwesome } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  TouchableOpacity,
} from "react-native";

interface AppInputProps {
  value: string;
  title?: string;
  onChangeText: (value: string) => void;
  isRequired?: boolean;
  isSecureText?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  isValidateControl: boolean;
}

const AppInput: React.FC<AppInputProps> = (props) => {
  const inputRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.container}>
      {props.title && (
        <Text style={styles.text}>
          {props.title}
          {props.isRequired && <Text style={{ color: "red" }}>*</Text>}
        </Text>
      )}
      <TextInput
        ref={inputRef}
        autoCapitalize="none"
        value={props.value}
        style={[
          styles.inputField,
          {
            borderColor:
              props.isRequired &&
              props.isValidateControl &&
              (!props.value ||
                (props.maxLength && props.value.length < props.maxLength))
                ? "red"
                : "#ABABAB",
          },
        ]}
        onChangeText={props.onChangeText}
        secureTextEntry={props.isSecureText && !showPassword}
        keyboardType={props.keyboardType}
      />

      {props.isSecureText && (
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 28 }}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FontAwesome name="eye-slash" size={20} />
          ) : (
            <FontAwesome name="eye" size={20} />
          )}
        </TouchableOpacity>
      )}
      {props.isValidateControl &&
        props.maxLength &&
        props.maxLength > props.value.length && (
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              color: "red",
              fontSize: 10,
            }}
          >{`${props.title ?? ""} ${
            props.maxLength
          } karakterden büyük olmalıdır.`}</Text>
        )}
    </View>
  );
};
export default AppInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 40,
    position: "relative",
  },
  text: {
    fontFamily: "Poppins_500Medium",
  },
  inputField: {
    position: "relative",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    lineHeight: 20,
    flex: 1,
    fontFamily: "Poppins_500Medium",
    minHeight: 40,
    maxHeight: 40,
  },
});
