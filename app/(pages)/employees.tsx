import { getEmployeeList } from "@/services/EmployeeService";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image
} from "react-native";


interface EmployeesPageProps {

}

const EmployeesPage: React.FC<EmployeesPageProps> = (props) => {
    const [employeeList, setEmployeeList] = useState([]);
    useEffect(() => {
        var getEmployeeListService = async () => {
            var res = await getEmployeeList(1);
            console.log(123, res)
            if (res) {
                setEmployeeList(res.data.items);
            }
        }

        getEmployeeListService();
    }, [])


    const renderItem = ({
        item,
    }: {
        item: any;
    }) => {
        return (
            <View>
                <Text>{item.first_name}</Text>
                <Image source={{ uri: item.image_url }} />
            </View>
        )
    };

    return (
        <View style={styles.container}>

            <FlatList
                data={employeeList}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}
export default EmployeesPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});