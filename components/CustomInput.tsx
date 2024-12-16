import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { Controller, Control, RegisterOptions, FieldValues } from 'react-hook-form';
import { Input } from './Input';

interface CustomInputProps {
  control: any;
  title?: string;
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  isPhoneNumber?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  control,
  title = null,
  name,
  placeholder,
  secureTextEntry,
  isPhoneNumber = false,
  keyboardType = "default",
  disabled = false
}) => {

  const formatPhoneNumberLive = (phone: string): string => {
    // Sadece rakamları al
    const digits = phone.replace(/\D/g, '');

    // Eğer boş ise geri döndür
    if (!digits) return '';

    // Formatlama kuralları
    let formatted = digits;
    if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    if (digits.length > 8) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    }
    return formatted;
  };;

  const handlePhoneChangeLive = (text: string, onChange: (value: string) => void) => {
    // Kullanıcı yazdıkça format uygula
    const formattedText = formatPhoneNumberLive(text);
    onChange(formattedText);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View className='flex flex-1'>
          {title && (<Text style={{ fontFamily: "Poppins_600SemiBold" }}>{title}</Text>)}
          <Input
            editable={!disabled}
            value={value ? value.toString() : ""}
            onChangeText={(text) => {
              if (isPhoneNumber) {
                handlePhoneChangeLive(text, onChange);
              } else {
                onChange(text);
              }
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
          />
          {error && (
            <Text style={{ alignSelf: 'stretch' }} className='text-rose-500'>
              {error.message || 'Error'}
            </Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
  },
});

export default CustomInput;
