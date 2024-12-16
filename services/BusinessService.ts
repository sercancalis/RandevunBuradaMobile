import { mainService } from "@/utils/axiosInstance"
 
export const addBusinessService = async (model: any) => {
    try {  
        var res = await mainService.post("Businesses", model, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        return res;
    } catch (error: any) { 
        return null;
    }
}