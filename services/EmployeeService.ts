import { mainService } from "@/utils/axiosInstance"
 
export const getEmployeeList = async (businessId: number) => {
    try {  
        var res = await mainService.get(`Employees/GetBussinessEmployees?businessId=${businessId}`);
        return res;
    } catch (error: any) { 
        console.log(123,error)
        return null;
    }
}