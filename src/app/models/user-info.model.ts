import { FormGroup } from "@angular/forms";

export interface UserInfo {
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  password?: string;
  newPassword?: string;
}

export function buildUserInfo(userInfo: Partial<FormGroup>): UserInfo {
  const userInfoToUpdate: UserInfo = {};
  if (userInfo && userInfo.get) {
    const emailControl = userInfo.get('email');
    if (emailControl && emailControl.value !== undefined) userInfoToUpdate.email = emailControl.value;

    const phoneNumberControl = userInfo.get('phoneNumber');
    if (phoneNumberControl && phoneNumberControl.value !== undefined) userInfoToUpdate.phoneNumber = phoneNumberControl.value;

    const firstNameControl = userInfo.get('firstName');
    if (firstNameControl && firstNameControl.value !== undefined && firstNameControl.value !== null) userInfoToUpdate.firstName = firstNameControl.value;

    const lastNameControl = userInfo.get('lastName');
    if (lastNameControl && lastNameControl.value !== undefined && lastNameControl.value !== null) userInfoToUpdate.lastName = lastNameControl.value;

    const middleNameControl = userInfo.get('middleName');
    if (middleNameControl && middleNameControl.value !== undefined && middleNameControl.value !== null) userInfoToUpdate.middleName = middleNameControl.value;

    const passwordControl = userInfo.get('password');
    if (passwordControl && passwordControl.value !== undefined) userInfoToUpdate.password = passwordControl.value;

    const newPasswordControl = userInfo.get('newPassword');
    if (newPasswordControl && newPasswordControl.value !== undefined) userInfoToUpdate.newPassword = newPasswordControl.value;
  }
  return userInfoToUpdate;
}
