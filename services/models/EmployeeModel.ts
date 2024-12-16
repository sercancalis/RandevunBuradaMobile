import { UserModel } from "./UserModel";

export interface EmployeeModel{
    id: number;
    userId: string;
    businessId: number;
    isConfirmed: boolean;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}

 
export interface EmployeeListModel{
    id: number;
    userId: string;
    businessId: number;
    isConfirmed: boolean;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
    userInfo: UserModel
}