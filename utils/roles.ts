import { Roles } from '@/types/globals'  

export const checkRole = (user: any ,role: Roles) => {
  return user?.publicMetadata?.role === role
}
 