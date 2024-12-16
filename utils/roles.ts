import { Roles } from '@/types/globals' 
import {  useUser } from '@clerk/clerk-expo'

export const checkRole = (role: Roles) => {
  const { user } = useUser() 
  return user?.publicMetadata?.role === role
}