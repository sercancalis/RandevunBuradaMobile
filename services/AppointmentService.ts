import { mainService } from "@/utils/axiosInstance"
 
export const addAppointment = async (model: any) => {
    try {  
        var res = await mainService.post("Appointments", model);
        return res;
    } catch (error: any) { 
        return null;
    }
}
