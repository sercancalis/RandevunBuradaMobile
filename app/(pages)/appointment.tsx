import HeaderPage from "@/components/HeaderPage";
import { FontAwesome } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Linking,
  Button,
  ScrollView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { getEmployeeList } from "@/services/EmployeeService";
import { getBusinessById } from "@/services/BusinessService";
import Toast from "react-native-toast-message";
import { useUser } from "@clerk/clerk-expo";
import { addAppointment, getActiveHours } from "@/services/AppointmentService";
interface AppointmentProps {

}

const Appointment: React.FC<AppointmentProps> = (props) => {
  const isShowImage = process.env.EXPO_PUBLIC_SHOW_IMAGE === "1";
  const { businessId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { width, height } = useWindowDimensions();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedPersonel, setSelectedPersonel] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sheetModalType, setSheetModalType] = useState<"personel" | "hour" | "time" | "services">("personel");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [personelList, setPersonelList] = useState<any>([]);
  const [business, setBusiness] = useState<any>(null);
  const [activeTimes, setActiveTimes] = useState<{ hour: string, isAvailable: boolean }[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);

  if (!businessId) {
    return null;
  }

  const getPersonelList = async () => {
    try {
      var res = await getEmployeeList(parseInt(businessId as string, 10));
      if (res?.status == 200) {
        setPersonelList(res.data.items)
      }
    } catch (error) {

    }
  }

  const getBusinessInfo = async () => {
    try {
      var res = await getBusinessById(parseInt(businessId as string, 10));
      if (res?.status == 200) {
        setBusiness(res.data);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (businessId) {
      getBusinessInfo();
      getPersonelList();
    }
  }, [businessId])

  const openBottomSheet = () => {
    setIsBottomSheetVisible(true);
    bottomSheetModalRef.current?.present();
  };

  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
    bottomSheetModalRef.current?.dismiss();
  };

  const toggleServiceSelection = (service: string) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(service)) {
        return prevSelectedServices.filter((item) => item !== service);
      } else {
        return [...prevSelectedServices, service];
      }
    });
  };

  const sendAppointment = async () => {
    if (!user) {
      Toast.show({
        text1: "Lütfen kullanıcı girişi yapınız",
        position: "bottom",
        type: "error"
      })
      return;
    }
    if (!selectedPersonel) {
      Toast.show({
        text1: "Lütfen personel seçiniz",
        position: "bottom",
        type: "error"
      })
      return;
    }
    if (!selectedDay) {
      Toast.show({
        text1: "Lütfen tarih seçiniz",
        position: "bottom",
        type: "error"
      })
      return;
    }
    if (!selectedTime) {
      Toast.show({
        text1: "Lütfen saat seçiniz",
        position: "bottom",
        type: "error"
      })
      return;
    }
    if (!selectedServices) {
      Toast.show({
        text1: "Lütfen servis seçiniz",
        position: "bottom",
        type: "error"
      })
      return;
    }
    try {
      setIsLoading(true)
      var model = {
        businessId: parseInt(businessId as string, 10),
        userId: user!.id,
        userName: user.fullName,
        personelId: selectedPersonel.userId,
        date: selectedDay,
        time: selectedTime,
        services: selectedServices.map((service: any) => service.name).join(",")
      }

      var res = await addAppointment(model);
      if (res) {
        Toast.show({
          text1: "Randevu Oluşturuldu.",
          position: "bottom",
          type: "success",
          onHide: () => router.push("/")
        })
      } else {
        setIsLoading(false);
        Toast.show({
          text1: "Randevu Oluşturulamadı",
          position: "bottom",
          type: "error"
        })
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

  const getActiveHoursService = async () => {
    try {
      var model = {
        businessId: parseInt(businessId as string, 10),
        personelId: selectedPersonel.userId,
        date: moment(selectedDay).format("YYYY-MM-DD")
      }
      var res = await getActiveHours(model);
      if (res?.status == 200) {
        setActiveTimes(res.data);
        setSelectedTime(null);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (selectedPersonel && selectedDay) getActiveHoursService();
    else setActiveTimes([])
  }, [selectedPersonel, selectedDay])

  return (
    <View style={styles.container}>

      <GestureHandlerRootView>
        <BottomSheetModalProvider>

          <HeaderPage title="Randevu Al" />
          <View
            style={{
              height: height,
              backgroundColor: "white",
              paddingVertical: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
            }}
          >

            <TouchableOpacity
              onPress={() => {
                setSheetModalType("personel");
                openBottomSheet();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderWidth: 1,
                marginHorizontal: 20,
                borderRadius: 10
              }}>
              <Text style={{ fontFamily: "Poppins_500Medium" }}>{selectedPersonel ? `${selectedPersonel.userInfo.first_name} ${selectedPersonel.userInfo.last_name}` : "Personel Seçin"}</Text>
              <FontAwesome name="chevron-down" size={20} />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", margin: 20, gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setSheetModalType("hour");
                  openBottomSheet();
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderRadius: 10
                }}>
                <Text style={{ fontFamily: "Poppins_500Medium" }}>{moment(selectedDay).format("DD.MM.YYYY")}</Text>
                <FontAwesome name="chevron-down" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSheetModalType("time");
                  openBottomSheet();
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderRadius: 10
                }}>
                <Text style={{ fontFamily: "Poppins_500Medium" }}>{selectedTime ?? "Saat Seçin"}</Text>
                <FontAwesome name="chevron-down" size={20} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSheetModalType("services");
                openBottomSheet();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderWidth: 1,
                marginHorizontal: 20,
                borderRadius: 10
              }}>
              <Text style={{ fontFamily: "Poppins_500Medium" }}>
                {selectedServices.length > 0
                  ? selectedServices.slice(0, 3).map((service: any) => service.name).join(", ") + (selectedServices.length > 3 ? "..." : "")
                  : "Hizmet Seçin"
                }
              </Text>
              <FontAwesome name="chevron-down" size={20} />
            </TouchableOpacity>

            <View style={{ position: "relative", height: height / 4 }}>
              <Carousel
                loop
                mode="parallax"
                width={width}
                height={width / 2}
                data={business?.imageUrls || []}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log("current index:", index)}
                renderItem={({ item, index }: any) => (
                  isShowImage ?
                    <Image
                      source={{
                        uri: item
                      }}
                      alt="Resim"
                      height={width / 2}
                      style={{ borderRadius: 10 }}
                      defaultSource={require("@/assets/images/randevu_burada_logo.png")}
                    />
                    :
                    <Image
                      source={require("@/assets/images/randevu_burada_logo.png")}
                      alt="Logo Icon"
                      style={{
                        width: width * 0.75,
                        height: height / 5,
                        backgroundColor: "white",
                        borderBottomWidth: 0.5,
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                      }}
                      resizeMode="contain"
                    />
                )}
              />
            </View>
            <View style={{ paddingHorizontal: 20, gap: 3 }}>
              <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}>
                {business?.name}
              </Text>
              <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}>
                {business?.address}
              </Text>

              {business?.phoneNumber && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `tel:${business.phoneNumber.replace(
                        /\s+/g,
                        ""
                      )}`
                    )
                  }
                >
                  <Text
                    style={{
                      color: "blue",
                      textDecorationLine: "underline",
                    }}
                  >
                    {business.phoneNumber}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: "#F99335",
                  padding: 10,
                  alignItems: "center",
                  borderRadius: 10,
                  marginTop: 50,
                }}
                onPress={sendAppointment}
                disabled={isLoading}
              >
                <Text style={{ flexDirection: "row", alignItems: "center", gap: 5, color: "white", fontFamily: "Poppins_600SemiBold" }}>
                  {isLoading && <ActivityIndicator />}
                  Randevu Oluştur
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          {isBottomSheetVisible && (
            <View style={styles.overlay} onTouchStart={closeBottomSheet} />
          )}

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={['50%']}
            onDismiss={closeBottomSheet}
          >
            <BottomSheetView style={styles.contentContainer}>
              {sheetModalType === "personel" ? <React.Fragment>
                <Text style={styles.title}>Personel Seçimi</Text>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  {personelList.map((person: any) => (
                    <TouchableOpacity
                      key={person.id}
                      style={styles.itemContainer}
                      onPress={() => {
                        setSelectedPersonel(person);
                        closeBottomSheet();
                      }}>
                      <Checkbox
                        onValueChange={() => {
                          setSelectedPersonel(person);
                          closeBottomSheet();
                        }}
                        value={person.id === selectedPersonel?.id}
                      />
                      <Text style={styles.itemLabel}>{`${person.userInfo.first_name} ${person.userInfo.last_name}`}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </React.Fragment>
                : sheetModalType === "hour" ?
                  <React.Fragment>
                    <Text style={styles.title}>Tarih Seçimi</Text>
                    {Platform.OS === "ios" && (
                      <RNDateTimePicker
                        mode="date"
                        value={selectedDay}
                        onChange={(event, date) => {
                          if (date) {
                            setSelectedDay(date);
                            closeBottomSheet();
                          }
                        }}
                        locale="tr"
                        minimumDate={new Date()}
                        maximumDate={maxDate}
                        display="inline"
                      />
                    )}
                    {Platform.OS === "android" && (
                      <Pressable
                        onPress={() => {
                          DateTimePickerAndroid.open({
                            value: selectedDay,
                            onChange: (event, date) => {
                              if (date) {
                                setSelectedDay(date);
                                closeBottomSheet();
                              }
                            },
                            mode: "date",
                            minimumDate: new Date(),
                            maximumDate: maxDate,
                            display: "spinner"
                          });
                        }}
                      >

                      </Pressable>
                    )}
                  </React.Fragment>
                  : sheetModalType === "time" ?
                    <React.Fragment>
                      <Text style={styles.title}>Saat Seçimi</Text>
                      <ScrollView contentContainerStyle={styles.grid}>
                        {activeTimes.map((data, index) => (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '50%',
                              marginBottom: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5
                              }}
                              onPress={() => {
                                setSelectedTime(data.hour);
                                closeBottomSheet();
                              }}
                              disabled={!data.isAvailable}
                            >
                              <Checkbox
                                onValueChange={() => {
                                  setSelectedTime(data.hour);
                                  closeBottomSheet();
                                }}
                                value={data.hour === selectedTime}
                              />
                              <Text style={[styles.itemLabel, { color: data.isAvailable ? "black" : "gray" }]}>{data.hour} {!data.isAvailable && "(Dolu)"}</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </React.Fragment>
                    : <React.Fragment>
                      <Text style={styles.title}>Hizmet Seçimi</Text>
                      <ScrollView contentContainerStyle={styles.grid}>
                        {business.businessServices.map((service: any, index: number) => (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '50%',
                              paddingVertical: 10,
                              marginBottom: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5
                              }}
                              onPress={() => toggleServiceSelection(service)}
                            >
                              <Checkbox
                                value={selectedServices.includes(service)}
                                onValueChange={() => toggleServiceSelection(service)}
                              />
                              <Text style={styles.itemLabel}>{service.name}</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </React.Fragment>
              }
            </BottomSheetView>
          </BottomSheetModal>

        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View >
  )
}
export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
    zIndex: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium"
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  secondItem: {
    marginLeft: '4%', // Add margin to the second item to keep spacing even
  },
});