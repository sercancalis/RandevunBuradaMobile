/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#494c5e",
    textLight: "#ccfbff",
    background: "#085564",
    color: "#fff",
    tint: "#085564",
    bgLight: "#cde5ee",
    orange: "#d27d5f",
    // alt ayarlanmadı
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    white: "#fff",
    red: "#e33a3e",
  },
  dark: {
    text: "#ECEDEE",
    textLight: "#ccfbff",
    background: "#151718",
    color: "#fff",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    white: "#cecece",
    red: "#e33a3e",
  },
};
