import Header from "@/components/Header";
import { getNotificationListService, sendNotificationAction } from "@/services/NotificationService";
import { NotificationModel, NotificationType } from "@/services/models/NotificationModel";
import { useUser } from "@clerk/clerk-expo";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from "react-native";
import Toast from "react-native-toast-message";


interface NotificationsProps {

}

const Notifications: React.FC<NotificationsProps> = (props) => {
    const [data, setData] = useState<NotificationModel[]>([]);
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const size = 20;
    const { user } = useUser();

    if (!user) {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text>Bildirimler için üye girişi yapmalısınız</Text>
            </View>
        )
    }

    const getNotificationList = async (receiverId: string, pageNumber: number) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const res = await getNotificationListService(pageNumber, size, receiverId);
            if (res?.status === 200 && res?.data) {
                const items = res.data.items;
                setData((prevData) => [...prevData, ...items]);
                setHasMore(items.length === size);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        if (hasMore && !isLoading) {
            setPage((prevPage) => {
                const nextPage = prevPage + 1;
                getNotificationList(user.id, nextPage);
                return nextPage;
            });
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return <ActivityIndicator style={{ marginVertical: 16 }} />;
    };

    const renderEmpty = () => {
        if (isLoading) return null;
        return (
            <View style={styles.centered}>
                <Text>Henüz bir bildirim bulunmamaktadır.</Text>
            </View>
        )
    };

    useEffect(() => {
        if (user) {
            setPage(0);
            setData([]);
            setHasMore(true);
            getNotificationList(user.id, 0)
        }
    }, [user])

    const sendAction = async (notificationId: number, action: boolean) => {
        try {
            var model = {
                id: notificationId,
                action: action,
                message: ""
            }
            var res = await sendNotificationAction(model);
            if (res?.status == 200 && res.data) {
                Toast.show({
                    text1: (action ? "Onay" : "Ret") + " işleminiz gerçekleştirilmiştir.",
                    position: "bottom",
                    type: "success"
                })

                router.push("/")

            } else {
                Toast.show({
                    text1: (action ? "Onay" : "Ret") + " işleminiz gerçekleştirilememiştir.",
                    position: "bottom",
                    type: "error"
                })
            }
        } catch (error) {
            Toast.show({
                text1: (action ? "Onay" : "Ret") + " işleminiz gerçekleştirilememiştir.",
                position: "bottom",
                type: "error"
            })
        }
    }
    return (
        <View style={styles.container}>
            <Header title="Bildirimler" showBackButton />
            <FlatList
                data={data}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        {item.notificationType === NotificationType.All || item.isComplete ? (
                            <React.Fragment>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.body}>{item.body}</Text>
                            </React.Fragment>
                        ) :
                            (
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        <TouchableOpacity onPress={() => sendAction(item.id, true)}>
                                            <Feather name="check-circle" size={24} color="green" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => sendAction(item.id, false)}>
                                            <Feather name="x-circle" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 4 }}>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.body}>{item.body}</Text>
                                    </View>
                                </View>
                            )}

                    </View>
                )}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5} // Trigger `loadMore` when 50% to the end
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    notificationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
    },
    body: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
});