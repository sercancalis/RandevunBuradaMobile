import { getEmployeeList } from "@/services/EmployeeService";
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { BlurView } from "expo-blur"
import Header from "@/components/Header";
import CustomInput from "@/components/CustomInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { getEmployeeSchema } from "@/schema/employeeSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mainService } from "@/utils/axiosInstance";
import Toast from "react-native-toast-message";
import { UserModel } from "@/services/models/UserModel";
import { EmployeeListModel, EmployeeModel } from "@/services/models/EmployeeModel";
import { useUser } from "@clerk/clerk-expo";

interface EmployeesPageProps {

}

const EmployeesPage: React.FC<EmployeesPageProps> = (props) => {
    const [employeeList, setEmployeeList] = useState<EmployeeListModel[]>([]);
    const [selectPersonel, setSelectPersonel] = useState<UserModel | null>(null);
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
    } = useForm<z.infer<typeof getEmployeeSchema>>({
        resolver: zodResolver(getEmployeeSchema),
        defaultValues: {
        }
    });



    useEffect(() => {
        var getEmployeeListService = async () => {
            var businessId = user?.publicMetadata?.businessId as number;
            var res = await getEmployeeList(businessId);
            if (res) {
                setEmployeeList(res.data.items);
            }
        }

        getEmployeeListService();
    }, [])


    const renderItem = ({
        item,
        index
    }: {
        item: any;
        index: number
    }) => {
        return (
            <View style={{
                flex: 1, // This ensures items are evenly distributed
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 10, // Adds space between rows
                marginRight: 10 // Adds space between items
            }}>
                <Image source={{ uri: item.userInfo.image_url }} style={{ width: 80, height: 80, borderWidth: .5, borderRadius: 100 }} />
                <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="uppercase">{`${item.userInfo.first_name} ${item.userInfo.last_name}`}</Text>
                <Text style={{ fontFamily: "Poppins_600SemiBold", color: "red", textAlign: "center" }}>{index === 0 ? "Patron" : "Personel"}</Text>
            </View>
        )
    };

    const getPersonel: SubmitHandler<z.infer<typeof getEmployeeSchema>> = async (data: z.infer<typeof getEmployeeSchema>) => {
        if (employeeList.find(x => x.userInfo.email_addresses[0].email_address === watch("email"))) {
            return Toast.show({
                text1: "Eklemek istediğiniz personel listenizde bulunmaktadır.",
                position: "bottom",
                type: "error"
            })
        }
        var result = await mainService.get<UserModel>(`Employees/GetEmployeeByEmail?email=${watch("email")}`)
        if (result.status === 200 && result.data) {
            setSelectPersonel(result.data)
        } else {
            Toast.show({
                text1: "Personel Bulunamadı",
                position: "bottom",
                type: "error"
            })
        }
    }

    const addPersonel = async () => {
        var model = {
            businessId: user?.publicMetadata?.businessId as number,
            userId: selectPersonel!.id,
        }
        try {
            var result = await mainService.post<EmployeeModel>(`Employees`, model)
            if (result.status === 200 && result.data) {
                Toast.show({
                    text1: "Personel Eklendi",
                    position: "bottom",
                    type: "success"
                })

                var newData: EmployeeListModel = {
                    ...result.data,
                    userInfo: selectPersonel!
                }
                setShowModal(false);
                setEmployeeList((prev) => [...prev, newData])
            } else {
                Toast.show({
                    text1: "Personel Eklenemedi",
                    position: "bottom",
                    type: "error"
                })
            }
        } catch (error) {
            Toast.show({
                text1: "Personel Eklenemedi",
                position: "bottom",
                type: "error"
            })
        }
    }

    return (
        <View style={styles.container}>
            <Header showBackButton title="Personeller" />
            <View style={{ paddingVertical: 20 }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 5, marginBottom: 20, marginHorizontal: 20 }} onPress={() => { setShowModal(true); reset() }}>
                    <FontAwesome name="plus-circle" size={20} />
                    <Text style={{ fontFamily: "Poppins_600SemiBold" }}>Personel Kaydet</Text>
                </TouchableOpacity>

                <FlatList
                    data={employeeList}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
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
                            height: height / 2.5,
                            width: width - 40,
                            borderRadius: 10,
                        }}>

                        <TouchableOpacity style={{ position: "absolute", right: 10, top: -10, backgroundColor: "red", borderRadius: 100, cursor: "pointer" }} onPress={() => setShowModal(false)}>
                            <Feather name="x-circle" size={25} color={"white"} />
                        </TouchableOpacity>

                        <View style={{ height: 80 }}>
                            <CustomInput
                                title="Personel Email Adresi"
                                control={control}
                                name="email"
                                keyboardType="email-address"
                                placeholder="Email Adres"
                            />
                        </View>
                        <TouchableOpacity onPress={handleSubmit(getPersonel)} style={{ backgroundColor: "red", padding: 10, alignItems: "center", borderRadius: 5, marginBottom: 20 }}>
                            <Text style={{ fontFamily: "Poppins_600SemiBold", color: "white", fontSize: 16 }}>Sorgula</Text>
                        </TouchableOpacity>

                        {selectPersonel && (
                            <View style={{ borderWidth: .5, borderRadius: 10, padding: 5 }}>
                                <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 20 }}>Personel Bilgileri</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                    <Image source={{ uri: selectPersonel.image_url }} style={{ width: 80, height: 80, borderWidth: .5, borderRadius: 100 }} />
                                    <View>
                                        <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 16 }}>{`${selectPersonel.first_name} ${selectPersonel.last_name}`}</Text>
                                        <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 14 }}>{`${selectPersonel.email_addresses[0].email_address}`}</Text>
                                        <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 14 }}>{`${selectPersonel.phone_numbers[0].phone_number}`}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={addPersonel} style={{ backgroundColor: "red", padding: 10, alignItems: "center", borderRadius: 5, marginTop: 10 }}>
                                    <Text style={{ fontFamily: "Poppins_600SemiBold", color: "white", fontSize: 16 }}>Personeli Kaydet</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </BlurView>
            )}
        </View>
    )
}
export default EmployeesPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});