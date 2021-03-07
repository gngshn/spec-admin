export interface User {
  id: string
  username: string
  password: string
}

export interface ChangePasswordDto {
  username: string
  oldPassword: string
  newPassword: string
}