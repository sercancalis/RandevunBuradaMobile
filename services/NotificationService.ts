import { PageRequestResponseModel } from "@/Models/PageRequestResponseModel";
import { mainService } from "@/utils/axiosInstance";
import { NotificationModel } from "./models/NotificationModel";

export const getNotificationListService = async (index: number, size:number, receiverId: string) => {
    try {
        var res = await mainService.get<PageRequestResponseModel<NotificationModel>>(`Notifications/GetNotificationList?page=${index}&pageSize=${size}&receiverId=${receiverId}`)
        return res;   
    } catch (error) {
        return null;
    }
}

export const sendNotificationAction = async (model:any) => {
    try {
        var res = await mainService.post<boolean>(`Notifications/NotificationAction`,model);
        return res;   
    } catch (error) {
        return null;
    }
}