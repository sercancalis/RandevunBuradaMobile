import React from 'react';
import { View, Text, StyleSheet, Pressable, PressableProps } from 'react-native';

interface CustomButtonProps extends PressableProps {
  onPress: () => void;
  text: string;
  bgColor?: string;
  fgColor?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  bgColor,
  fgColor,
  disabled,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        bgColor ? { backgroundColor: disabled ? "gray" : bgColor } : {},
      ]}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: '#3B71F3',
  },

  container_SECONDARY: {
    borderColor: '#3B71F3',
    borderWidth: 2,
  },

  container_TERTIARY: {},

  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_SECONDARY: {
    color: '#3B71F3',
  },

  text_TERTIARY: {
    color: 'gray',
  },
});

export default CustomButton;
