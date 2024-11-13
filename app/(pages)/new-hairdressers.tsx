import HeaderPage from "@/components/HeaderPage";
import React from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";


interface NewHairdressersPageProps{

}

const NewHairdressersPage:React.FC<NewHairdressersPageProps> = (props) => {
return (
  <View style={styles.container}>
    <HeaderPage title="İşletme Kaydet"/>
    <View className="flex flex-col bg-white"></View>
  </View>
  )
}
export default NewHairdressersPage;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  }
});