import { mainService } from "@/utils/axiosInstance"
 
export const addBusinessService = async (model: any) => {
    try { 
        console.log(123123123,model)
        var res = await mainService.post("Businesses", model, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        return res;
    } catch (error: any) {
        console.log(111,error) 
        return null;
    }
}