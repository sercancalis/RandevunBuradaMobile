import { servicesSchema } from "@/schema/servicesSchema";
import { addServicesService, getServicesList } from "@/services/ServicesService";
import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { BlurView } from "expo-blur"
import Header from "@/components/Header";
import { Feather, FontAwesome } from "@expo/vector-icons";
import CustomInput from "@/components/CustomInput";
import { ServiceModel } from "@/services/models/ServiceModel";

interface ServicesProps {

}

const Services: React.FC<ServicesProps> = (props) => {
    const [serviceList, setServiceList] = useState<ServiceModel[]>([]);
    const { width, height } = Dimensions.get("screen");
    const [showModal, setShowModal] = useState(false);
    const { user } = useUser()
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<z.infer<typeof servicesSchema>>({
        resolver: zodResolver(servicesSchema),
        defaultValues: {
        }
    });

    useEffect(() => {
        var getServiceList = async () => {
            var businessId = user?.publicMetadata?.businessId as number;
            var res = await getServicesList(businessId);
            if (res) {
                setServiceList(res.data.items);
            }
        }

        getServiceList();
    }, [])


    const renderItem = ({
        item,
        index
    }: {
        item: ServiceModel;
        index: number
    }) => {
        return (
            <View style={{
                marginHorizontal: 20,
                borderBottomWidth: 1,
                padding: 10
            }}>
                <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="uppercase">{`${item.name}`}</Text>
            </View>
        )
    };

    const addService: SubmitHandler<z.infer<typeof servicesSchema>> = async (data: z.infer<typeof servicesSchema>) => {
        try {
            var model = {
                businessId: user?.publicMetadata?.businessId as number,
                name: data.name
            }

            var result = await addServicesService(model);
            if (result && result.status === 200 && result.data) {
                Toast.show({
                    text1: "Hizmet Eklendi",
                    position: "bottom",
                    type: "success"
                })

                setShowModal(false);
                setServiceList((prev) => [...prev, result!.data])
            } else {
                Toast.show({
                    text1: "Hizmet Eklenemedi",
                    position: "bottom",
                    type: "error"
                })
            }
        } catch (error) {
            Toast.show({
                text1: "Hizmet Eklenemedi",
                position: "bottom",
                type: "error"
            })
        }
    }

    return (
        <View style={styles.container}>
            <Header showBackButton title="Hizmetler" />
            <View style={{ paddingVertical: 20 }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 5, marginBottom: 20, marginHorizontal: 20 }} onPress={() => { setShowModal(true); reset() }}>
                    <FontAwesome name="plus-circle" size={20} />
                    <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Hizmet Ekle</Text>
                </TouchableOpacity>

                <FlatList
                    data={serviceList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>

            {showModal && (
                <BlurView style={{
                    position: "absolute",
                    height: height,
                    width: width,
                    zIndex: 9999,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View
                        className="shadow"
                        style={{
                            margin: 20,
                            padding: 20,
                            backgroundColor: "white",
                            height: height / 5,
                            width: width - 40,
                            borderRadius: 10,
                        }}>

                        <TouchableOpacity style={{ position: "absolute", right: 10, top: -10, backgroundColor: "red", borderRadius: 100, cursor: "pointer" }} onPress={() => setShowModal(false)}>
                            <Feather name="x-circle" size={25} color={"white"} />
                        </TouchableOpacity>

                        <View style={{ height: 90 }}>
                            <CustomInput
                                title="Hizmet"
                                control={control}
                                name="name"
                                placeholder="Lütfen Hizmet Giriniz"
                            />
                        </View>
                        <TouchableOpacity onPress={handleSubmit(addService)} style={{ backgroundColor: "red", padding: 10, alignItems: "center", borderRadius: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "Poppins_600SemiBold", color: "white", fontSize: 16 }}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            )}
        </View>
    )
}
export default Services;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});