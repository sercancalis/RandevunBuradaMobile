import { mainService } from "@/utils/axiosInstance"
 
export const getServicesList = async (businessId: number) => {
    try {  
        var res = await mainService.get(`BusinessServices?businessId=${businessId}`);
        return res;
    } catch (error: any) {  
        return null;
    }
}

export const addServicesService = async (model: any) => {
    try {   
        var res = await mainService.post(`BusinessServices`,model);
        return res;
    } catch (error: any) {  
        return null;
    }
}