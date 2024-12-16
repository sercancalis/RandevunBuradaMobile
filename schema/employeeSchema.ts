import { z } from "zod";

export const getEmployeeSchema = z.object({
    email: z.string({ required_error: "Lütfen email giriniz" }), 
  });