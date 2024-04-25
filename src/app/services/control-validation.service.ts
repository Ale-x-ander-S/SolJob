import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";

@Injectable({
  providedIn: "root"
})

export class ControlValidationService {

  getFirstNameValidationErrorMessage(firstNameControl: FormControl): string | undefined {
    if (firstNameControl.errors?.["required"]) {
      return "Обязательное поле";
    }
    if (/[0-9]/.test(firstNameControl.value)) {
      return "Имя не должно содержать чисел";
    }
    return undefined;
  }

  getEmailValidationErrorMessage(emailControl: FormControl): string | undefined {
    if (emailControl.errors?.["required"]) {
      return "Обязательное поле";
    }
    if (emailControl.errors?.["email"]) {
      return "Введите корректный Email";
    }
    return undefined;
  }

  getPasswordValidationErrorMessage(passwordControl: FormControl): string | undefined {
    if (passwordControl.errors?.["required"]) {
      return "Обязательное поле";
    }
    if (passwordControl.value && passwordControl.value.length < 6) {
      return "Минимальная длина пароля 6 символов";
    }
    return undefined;
  }

  checkPasswordMatch(passwordControl: FormControl, repeatedPasswordControl: FormControl): string | undefined {
    if (passwordControl.value !== repeatedPasswordControl.value) {
      return "Пароли не совпадают";
    }
    return undefined;
  }

  getPasswordValidationErrorMessageOrMatchError(passwordControl: FormControl, repeatedPasswordControl: FormControl): string | undefined {
    const passwordError = this.getPasswordValidationErrorMessage(passwordControl);
    return passwordError ? passwordError : this.checkPasswordMatch(passwordControl, repeatedPasswordControl);
  }

  getDateOfBirthValidationErrorMessage(dayControl: FormControl, monthControl: FormControl, yearControl: FormControl): string | undefined {
    const day = +dayControl.value;
    const month = +monthControl.value;
    const year = +yearControl.value;

    if (!day || !month || !year) {
      return "Обязятельные поля";
    }
    const currentYear = new Date().getFullYear();
    if (year > currentYear || year < 1900) {
      return "Некорректная дата";
    }
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) {
      return "Некорректная дата";
    }
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    if (date > minBirthDate) {
      return "По закону работать можно с 14 лет";
    }
    return undefined;
  };

  getPhoneNumberValidationErrorMessage(phoneControl: FormControl): string | undefined {
    const phoneNumber = phoneControl.value;
    if (!phoneNumber) {
      return "Обязательное поле";
    }
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedPhoneNumber.length !== 11) {
      return "Некорректный номер телефона";
    }
    if (!cleanedPhoneNumber.startsWith('7')) {
      return "Некорректный формат номера телефона";
    }
    return undefined;
  }

  getIncomeValidationErrorMessage(fromValueControl: FormControl, toValueControl?: FormControl): string | undefined {
    const fromValue = fromValueControl.value;
    const toValue = toValueControl?.value;
    if (!fromValue) {
      return "Заполните обязательное поле";
    }
    const fromNum = +fromValue;
    const toNum = +toValue;
    if (isNaN(fromNum) || isNaN(toNum)) {
      return "Неверный формат числа";
    }
    if (toNum && fromNum > toNum) {
      return "Нижний уровень дохода не может быть больше верхнего";
    }
    return undefined;
  }

}
