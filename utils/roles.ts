import { Roles } from '@/types/globals' 
import {  useUser } from '@clerk/clerk-expo'

export const checkRole = async (role: Roles) => {
  const { user } = await useUser() 
  return user?.publicMetadata?.role === role
}