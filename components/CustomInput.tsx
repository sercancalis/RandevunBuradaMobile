import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, Control, RegisterOptions, FieldValues } from 'react-hook-form';
import { Input } from './Input';

interface CustomInputProps {
  control: any; 
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  isPhoneNumber?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  control, 
  name,
  placeholder,
  secureTextEntry,
  isPhoneNumber= false,
}) => {

  const formatPhoneNumber = (phone: string): string => {
     
    return phone;
  };
   
  
  return (
    <Controller
      control={control} 
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View className='flex'>  
          <Input
            value={value ? value.toString(): ""}
            onChangeText={(text) => { 
              onChange(isPhoneNumber ? formatPhoneNumber(text) : text);
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            style={styles.input}
            secureTextEntry={secureTextEntry}
          />
          {error && (
            <Text style={{ color: 'red', alignSelf: 'stretch' }}>
              {error.message || 'Error'}
            </Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {  
    backgroundColor: 'white', 
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    fontSize: 16,
  },
});

export default CustomInput;
