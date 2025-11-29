export type ActionState<T = unknown> = {
  error?: string
  success?: boolean
  data?: T
}

export type UserRole = 'admin' | 'viewer'

export type Organisation = {
  id: string
  name: string
  created_at: string
}

export type UserOrganisation = {
  user_id: string
  organisation_id: string
  role: UserRole
  created_at: string
}
