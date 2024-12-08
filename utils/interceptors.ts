import { mainService } from "@/utils/axiosInstance";
import { useAuth } from "@clerk/clerk-expo";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const SetupInterceptors = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  
  useEffect(() => {
    const requestInterceptor = mainService.interceptors.request.use(
      async (config:any) => {
        try {
          // Token al ve istek başlıklarına ekle
          const token = await getToken(); 
          if (token) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`,  
            };
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = mainService.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response && error.response.status === 401)
          router.replace("/");
        return Promise.reject(error);
      }
    );

    return () => {
      mainService.interceptors.request.eject(requestInterceptor);
      mainService.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  return null;
};
