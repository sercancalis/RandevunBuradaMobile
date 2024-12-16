export interface UserModel {
    id: string
    object: string
    username: string
    first_name: string
    last_name: string
    image_url: string
    has_image: boolean
    primary_email_address_id: string
    primary_phone_number_id: string
    primary_web3_wallet_id: any
    password_enabled: boolean
    two_factor_enabled: boolean
    totp_enabled: boolean
    backup_code_enabled: boolean
    email_addresses: EmailAddress[]
    phone_numbers: PhoneNumber[]
    web3_wallets: any[]
    passkeys: any[]
    external_accounts: any[]
    saml_accounts: any[]
    enterprise_accounts: any[]
    public_metadata: PublicMetadata
    private_metadata: PrivateMetadata
    unsafe_metadata: UnsafeMetadata
    external_id: any
    last_sign_in_at: number
    banned: boolean
    locked: boolean
    lockout_expires_in_seconds: any
    verification_attempts_remaining: number
    created_at: number
    updated_at: number
    delete_self_enabled: boolean
    create_organization_enabled: boolean
    last_active_at: number
    mfa_enabled_at: any
    mfa_disabled_at: any
    legal_accepted_at: any
    profile_image_url: string
  }
  
  export interface EmailAddress {
    id: string
    object: string
    email_address: string
    reserved: boolean
    verification: Verification
    linked_to: any[]
    created_at: number
    updated_at: number
  }
  
  export interface Verification {
    status: string
    strategy: string
    attempts: number
    expire_at: number
  }
  
  export interface PhoneNumber {
    id: string
    object: string
    phone_number: string
    reserved_for_second_factor: boolean
    default_second_factor: boolean
    reserved: boolean
    verification: Verification2
    linked_to: any[]
    backup_codes: any
    created_at: number
    updated_at: number
  }
  
  export interface Verification2 {
    status: string
    strategy: string
    attempts: number
    expire_at: number
  }
  
  export interface PublicMetadata {}
  
  export interface PrivateMetadata {}
  
  export interface UnsafeMetadata {}
  