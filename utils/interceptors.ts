import { mainService } from "@/utils/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const SetupInterceptors = () => {
  const router = useRouter();

  useEffect(() => {
    const requestInterceptor = mainService.interceptors.request.use(
      async (config) => {
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
