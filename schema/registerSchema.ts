import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string({ required_error: "Lütfen isim giriniz" }),
    lastName: z.string({ required_error: "Lütfen soyisim giriniz" }),
    username: z.string({ required_error: "Lütfen kullanıcı adı giriniz" }).min(4,{message:"Kullanıcı adı minimum 4 karakter olmalıdır"}),
    emailAddress: z.string({ required_error: "Lütfen email adresinizi giriniz" }),
    phoneNumber: z.string({ required_error: "Lütfen telefon numarasını giriniz" }).min(15,{message:"Lütfen geçerli bir telefon numarası giriniz"}),
    password: z.string({ required_error: "Lütfen telefon numarasını giriniz" }).min(8,{message:"Şifre minimum 8 karakter olmalıdır"}),
  });