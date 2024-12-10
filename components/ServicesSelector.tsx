import React from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

interface ServicesSelectorProps {
    control: any;
    name: string;
    error?: string;
}

const ServicesSelector: React.FC<ServicesSelectorProps> = ({ control, name, error }) => {
    console.log(error)
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => (
                <View style={styles.container}>
                    {value?.map((service: string, index: number) => (
                        <View key={index} style={styles.serviceContainer}>
                            <TextInput
                                value={service}
                                onChangeText={(text: string) => {
                                    const updatedServices = [...value]; // field'dan gelen mevcut veriyi kopyala
                                    updatedServices[index] = text; // Değeri güncelle
                                    onChange(updatedServices); // Yeni veriyi Controller'a gönder
                                }}
                                style={styles.input}
                                placeholder="Hizmet adı girin"
                            />
                            {index > 0 && (
                                <Button
                                    title="-"
                                    onPress={() => {
                                        const updatedServices = value.filter((_: any, i: any) => i !== index); // Seçilen indeksi sil
                                        onChange(updatedServices); // Silinen veriyi Controller'a gönder
                                    }}
                                />
                            )}


                        </View>
                    ))}
                    <Button
                        title="+"
                        onPress={() => {
                            const updatedServices = [...(value || []), '']; // Yeni bir boş input ekle
                            onChange(updatedServices); // Yeni listeyi Controller'a gönder
                        }}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    serviceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginRight: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 14,
    },
});

export default ServicesSelector;
