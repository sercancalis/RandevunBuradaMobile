import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

interface MyCalendarProps {}
const { width } = Dimensions.get("screen");
const MyCalendar: React.FC<MyCalendarProps> = (props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dates, setDates] = useState<
    { day: string; date: number; fullDate: string }[]
  >([]);

  useEffect(() => {
    const tempDates: { day: string; date: number; fullDate: string }[] = [];
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    setSelectedDate(todayISO);

    for (let i = 0; i <= 14; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let dayLabel = "";
      if (i === 0) {
        dayLabel = "Bugün";
      } else if (i === 1) {
        dayLabel = "Yarın";
      } else {
        dayLabel = dayNames[currentDate.getDay()];
      }

      tempDates.push({
        day: dayLabel,
        date: currentDate.getDate(),
        fullDate: currentDate.toISOString().split("T")[0],
      });
    }
    setDates(tempDates);
  }, []);
  const renderItem = ({
    item,
  }: {
    item: { day: string; date: number; fullDate: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.dateContainer,
        item.fullDate === selectedDate && styles.selectedDate,
      ]}
      onPress={() => setSelectedDate(item.fullDate)}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: item.fullDate === selectedDate ? "#fff" : "#000",
        }}
      >
        {item.day}
      </Text>
      <Text
        style={{
          marginTop: 5,
          fontSize: 20,
          color: item.fullDate === selectedDate ? "#fff" : "#666",
        }}
      >
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dates}
        horizontal
        keyExtractor={(item) => item.fullDate}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
export default MyCalendar;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  dateContainer: {
    padding: 9,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
    width: width / 6.2,
  },
  selectedDate: {
    backgroundColor: "#00adf5",
  },
});
