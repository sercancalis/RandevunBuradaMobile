import { z } from "zod";

export const loginSchema = z.object({
    input: z.string({ required_error: "Lütfen giriş bilgilerinizi giriniz" }),
    password: z.string({required_error:"Lütfen şifre giriniz"})
  });