import { PlaceModel } from "@/Models/PlaceModel";
import Header from "@/components/Header";
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
  Alert
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import RNDateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { getEmployeeList } from "@/services/EmployeeService";
import { getBusinessById, getBusinessList } from "@/services/BusinessService";
import Toast from "react-native-toast-message";
import { useUser } from "@clerk/clerk-expo";
import { addAppointment } from "@/services/AppointmentService";
interface AppointmentProps {

}

const Appointment: React.FC<AppointmentProps> = (props) => {
  const { businessId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { width, height } = useWindowDimensions();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedPersonel, setSelectedPersonel] = useState<any>(null);
  const [selectedHour, setSelectedHour] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sheetModalType, setSheetModalType] = useState<"personel" | "hour" | "time" | "services">("personel");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [personelList, setPersonelList] = useState<any>([]);
  const [business, setBusiness] = useState<any>(null);
  const [showAppointment, setShowAppointment] = useState(true);
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
        console.log(555, res.data)
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

  const getCustomDay = (day: number) => (day === 0 ? 6 : day - 1);

  const getAvailableTimes = () => {
    const now = selectedHour;
    const currentDay = getCustomDay(now.getDay());

    // Günün çalışma saatlerini bul
    const todaysWorkingHours = business.workingHours.find(
      (wh: any) => wh.workingDay === currentDay
    );

    if (!todaysWorkingHours) {
      Toast.show({
        text1: "Çalışma saatleri bulunamadı",
        position: "bottom",
        type: "error"
      })
      setShowAppointment(false);
      return [];
    }

    // Başlangıç ve bitiş saatlerini al
    const [start, end] = todaysWorkingHours.value.split("–");
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const times: string[] = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    // Yarım saatlik aralıklarla saatleri oluştur
    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      times.push(
        `${currentHour.toString().padStart(2, "0")}:${currentMinute
          .toString()
          .padStart(2, "0")}`
      );

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    return times;
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
    if (!selectedPersonel) {
      Toast.show({
        text1: "Lütfen personel seçiniz",
        position: "bottom",
        type: "error"
      })
      return;
    }

    if (!selectedHour) {
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

    var model = {
      businessId: parseInt(businessId as string, 10),
      userId: user!.id,
      personelId: selectedPersonel.id,
      date: selectedHour,
      time: selectedTime,
      services: selectedServices.join(",")
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
      Toast.show({
        text1: "Randevu Oluşturulamadı",
        position: "bottom",
        type: "error"
      })
    }
  }

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
                <Text style={{ fontFamily: "Poppins_500Medium" }}>{moment(selectedHour).format("DD.MM.YYYY")}</Text>
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
              <Text style={{ fontFamily: "Poppins_500Medium" }}>{selectedServices.length > 0 ? selectedServices.slice(0, 3).join(", ") + (selectedServices.length > 3 ? "..." : "") : "Hizmet Seçin"}</Text>
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
                  <Image
                    source={{
                      uri: item,
                    }}
                    alt="Resim"
                    height={width / 2}
                    style={{ borderRadius: 10 }}
                    defaultSource={require("@/assets/images/randevu_burada_logo.png")}
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

              {showAppointment && (<TouchableOpacity
                style={{
                  backgroundColor: "#F99335",
                  padding: 10,
                  alignItems: "center",
                  borderRadius: 10,
                  marginTop: 50,
                }}
                onPress={sendAppointment}
              >
                <Text style={{ color: "white", fontFamily: "Poppins_600SemiBold" }}>
                  Randevu Oluştur
                </Text>
              </TouchableOpacity>
              )}
            </View>
          </View>


          {isBottomSheetVisible && (
            <View style={styles.overlay} onTouchStart={closeBottomSheet} />
          )}

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={['45%']}
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
                        value={selectedHour}
                        onChange={(event, date) => {
                          if (date) {
                            setSelectedHour(date);
                            closeBottomSheet();
                          }
                        }}
                        locale="tr"
                        minimumDate={new Date()}
                        display="inline"
                      />
                    )}
                    {Platform.OS === "android" && (
                      <Pressable
                        onPress={() => {
                          DateTimePickerAndroid.open({
                            value: selectedHour,
                            onChange: (event, date) => {
                              if (date) {
                                setSelectedHour(date);
                                closeBottomSheet();
                              }
                            },
                            mode: "date",
                            minimumDate: new Date(),
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
                      <ScrollView contentContainerStyle={styles.scrollContent}>
                        {getAvailableTimes().map((data, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.itemContainer}
                            onPress={() => {
                              setSelectedTime(data);
                              closeBottomSheet();
                            }}
                          >
                            <Checkbox
                              onValueChange={() => {
                                setSelectedTime(data);
                                closeBottomSheet();
                              }}
                              value={data === selectedTime}
                            />
                            <Text style={styles.itemLabel}>{data}</Text>
                          </TouchableOpacity>
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
                            <TouchableOpacity style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 5
                            }}>
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
    zIndex: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 25,
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
    fontSize: 16,
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
  },
  secondItem: {
    marginLeft: '4%', // Add margin to the second item to keep spacing even
  },
});