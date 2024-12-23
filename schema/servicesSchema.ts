import { z } from "zod";

export const servicesSchema = z.object({
    name: z.string({ required_error: "Lütfen hizmet giriniz" }).min(3,{message:"Hizmet ismi min 3 karakter olmalıdır"}), 
  });