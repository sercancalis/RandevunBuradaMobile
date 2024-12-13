export {}

// Create a type for the roles
export type Roles = 'admin' | 'boss' | 'personel' | 'user'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}