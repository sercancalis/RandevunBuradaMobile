import Header from "@/components/Header";
import { getNotificationListService } from "@/services/NotificationService";
import { NotificationModel } from "@/services/models/NotificationModel";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList
} from "react-native";


interface NotificationsProps {

}

const Notifications: React.FC<NotificationsProps> = (props) => {
    const [data, setData] = useState<NotificationModel[]>([])
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
                setHasMore(items.length === size); // If less than `size`, no more data
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

    const renderEmpty = () => (
        <View style={styles.centered}>
            <Text>Henüz bir bildirim bulunmamaktadır.</Text>
        </View>
    );

    useEffect(() => {
        if (user) {
            setPage(0);
            setData([]);
            setHasMore(true);
            getNotificationList(user.id, 0)
        }
    }, [user])
    return (
        <View style={styles.container}>
            <Header title="Bildirimler" showBackButton />
            <FlatList
                data={data}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.body}>{item.body}</Text>
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