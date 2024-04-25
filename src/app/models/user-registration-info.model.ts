export interface UserRegistrationInfo {
  firstName: string,
  email: string,
  password: string
  userType: number
}
export function buildUserRegistrationInfo(data: { [key: string]: any }, userType: number): UserRegistrationInfo {
  if (!data["firstName"] || typeof data["firstName"] !== 'string') {
    throw new Error('First name is missing or invalid.');
  }
  if (!data["email"] || typeof data["email"] !== 'string') {
    throw new Error('Email is missing or invalid.');
  }
  if (!data["password"] || typeof data["password"] !== 'string') {
    throw new Error('Password is missing or invalid.');
  }
  if (!userType) {
    throw new Error('User type is missing.');
  }

  return {
    firstName: data["firstName"],
    email: data["email"],
    password: data["password"],
    userType: userType
  };
}
