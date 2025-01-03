import { mainService } from "@/utils/axiosInstance"
 
export const addAppointment = async (model: any) => {
    try {  
        var res = await mainService.post("Appointments", model);
        return res;
    } catch (error: any) { 
        return null;
    }
}

export const getActiveHours = async (model: any) => {
    try {  
        var res = await mainService.post("Appointments/GetActiveHours", model);
        return res;
    } catch (error: any) { 
        return null;
    }
}