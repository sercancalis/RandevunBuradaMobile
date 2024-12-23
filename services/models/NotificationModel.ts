export interface NotificationModel{
    id: number
    title: string
    body: string
    senderId: string
    receiverId: string
    notificationType: NotificationType
    createdDate: Date
    updatedDate?: Date
    isActive: boolean 
}

export enum NotificationType
{ 
    All = 0, 
    SaveBusiness = 1, 
    SaveEmployee = 2, 
    RequestAppointment = 3, 
    ConfirmAppointment = 4, 
    RejectAppointment = 5, 
    RevisedAppointment = 6,
}
