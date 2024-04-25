export interface UserLoginInfo {
  email: string,
  password: string
  userType: number
}
export function buildUserLoginInfo(data: { [key: string]: any }): UserLoginInfo {
  if (!data["email"] || typeof data["email"] !== 'string') {
    throw new Error('Email is missing or invalid.');
  }
  if (!data["password"] || typeof data["password"] !== 'string') {
    throw new Error('Password is missing or invalid.');
  }
  if (!data["userType"] || typeof data["userType"] !== 'number') {
    throw new Error('User type is missing.');
  }

  return {
    email: data["email"],
    password: data["password"],
    userType: data["userType"]
  };
}
