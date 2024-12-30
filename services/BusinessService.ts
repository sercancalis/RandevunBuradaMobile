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

export const getBusinessList = async (category: string) => {
    try {  
        var res = await mainService.get(`Businesses?page=${0}&pageSize=${50}&category=${category}`);
        return res;
    } catch (error: any) { 
        return null;
    }
}

export const getBusinessById = async (id: number) => {
    try {  
        var res = await mainService.get(`Businesses/GetBusinessById?id=${id}`);
        return res;
    } catch (error: any) { 
        return null;
    }
}