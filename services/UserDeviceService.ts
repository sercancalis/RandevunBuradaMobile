import { mainService } from "@/utils/axiosInstance";

export const saveUserDeviceService = async (model: any) => {
    try {    
        var res = await mainService.post(`UserDevices`,model);
        return res;
    } catch (error: any) {  
        return null;
    }
}