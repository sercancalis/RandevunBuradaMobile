import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';


interface AppDropdownPickerProps {
    placeholder?: string;
    defaultValue: any;
    onSelect: (value: any) => void;
    data: { label: string, value: any }[];
    isRequired?: boolean;
    requiredMessage?: string;
}

const AppDropdownPicker: React.FC<AppDropdownPickerProps> = (props) => {
    const [value, setValue] = useState<string | null>(props.defaultValue ?? null);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        if (props.defaultValue) {
            props.onSelect(props.defaultValue);
            setValue(props.defaultValue);
            setIsFocus(false);
        }
    }, [props.defaultValue])

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={props.data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? props.placeholder ?? "Lütfen Seçiniz" : '...'}
                searchPlaceholder="Ara..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    props.onSelect(item.value);
                    setValue(item.value);
                    setIsFocus(false);
                }}
            // renderLeftIcon={() => (
            //     <AntDesign
            //         style={styles.icon}
            //         color={isFocus ? 'blue' : 'black'}
            //         name="Safety"
            //         size={20}
            //     />
            // )}
            />
            {props.isRequired && props.requiredMessage && (
                <Text className="text-rose-500">{props.requiredMessage}</Text>
            )}
        </View>
    );
}
export default AppDropdownPicker;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    dropdown: {
        height: 40,
        backgroundColor: 'white',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});