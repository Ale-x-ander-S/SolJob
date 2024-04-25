import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../intefaces/api-response.interface";
import { UserRegistrationInfo } from "../models/user-registration-info.model";
import { UserLoginInfo } from "../models/user-login-info.model";
import { UserInfo } from "../models/user-info.model";
import { Profession } from "../intefaces/profession.interface";
import { Resume, ResumeToUpdate } from "../models/resume.model";
import { Vacancy, VacancyToServer, VacancyToUpdate } from "../models/vacancy.model";
import { SearchSettings } from "../intefaces/search-settings.interface";
import { JobseekerFavorite } from "../intefaces/jobseeker-favorite.interface";
import { JobseekerResponse } from "../intefaces/jobseeker-responce.interface";
import { VacancyResponse } from "../intefaces/jobseeker-responsive-vacancy";

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private http = inject(HttpClient);
  private userUrl = "https://localhost:7149/api/UserAPI/";
  private professionUrl = "https://localhost:7149/api/ProfessionAPI/";
  private resumeUrl = "https://localhost:7149/api/ResumeAPI/";
  private vacancyUrl = "https://localhost:7149/api/VacancyAPI/";
  private jobseekerFavoriteUrl = "https://localhost:7149/api/JobseekerFavoriteAPI/";
  private jobseekerVacancyResponseUrl = "https://localhost:7149/api/JobseekerResponseAPI/";
  private employerVacancyResponseUrl = "https://localhost:7149/api/EmployerResponseAPI/";

  registration(userRegistrationInfo: UserRegistrationInfo): Observable<ApiResponse<UserRegistrationInfo>> {
    return this.http.post<ApiResponse<UserRegistrationInfo>>(`${this.userUrl}registration`, userRegistrationInfo);
  }

  login(userLoginInfo: UserLoginInfo): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.userUrl}login`, userLoginInfo);
  }

  // Users --------------------------------------------------------------------

  getUserInfo(userId: number): Observable<ApiResponse<UserInfo>> {
    return this.http.get<ApiResponse<UserInfo>>(`${this.userUrl}${userId}`);
  }

  updateUserInfo(userId: number, userInfoToUpdate: UserInfo): Observable<ApiResponse<UserInfo>> {
    return this.http.patch<ApiResponse<UserInfo>>(`${this.userUrl}${userId}`, userInfoToUpdate);
  }

  deleteUser(userId: number, passwordToConfirmDeleting: UserInfo): Observable<ApiResponse<boolean>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: passwordToConfirmDeleting
    };
    return this.http.delete<ApiResponse<any>>(`${this.userUrl}${userId}`, options);
  }


  // Professions --------------------------------------------------------------------

  getProfessions(): Observable<ApiResponse<Profession[]>> {
    return this.http.get<ApiResponse<Profession[]>>(this.professionUrl);
  }

  getProfession(professionId: number): Observable<ApiResponse<Profession>> {
    return this.http.get<ApiResponse<Profession>>(`${this.professionUrl}${professionId}`);
  }

  createProfession(professionName: string): Observable<ApiResponse<Profession>> {
    return this.http.post<ApiResponse<Profession>>(this.professionUrl, {professionName});
  }

  // Resume --------------------------------------------------------------------

  getResume(userId: number): Observable<ApiResponse<Resume>> {
    return this.http.get<ApiResponse<Resume>>(`${this.resumeUrl}${userId}`);
  }
  createResume(resume: Resume): Observable<ApiResponse<Resume>> {
    return this.http.post<ApiResponse<Resume>>(this.resumeUrl, resume);
  }

  updateResume(userId: number, resumeFieldsToUpdate: ResumeToUpdate): Observable<ApiResponse<Resume>> {
    return this.http.patch<ApiResponse<Resume>>(`${this.resumeUrl}${userId}`, resumeFieldsToUpdate);
  }

  deleteResume(userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.resumeUrl}${userId}`);
  }

  // Vacancy --------------------------------------------------------------------

  getEmployerVacancies(userId: number): Observable<ApiResponse<Vacancy[]>> {
    return this.http.get<ApiResponse<Vacancy[]>>(`${this.vacancyUrl}${userId}`);
  }
  createVacancy(vacancy: VacancyToServer): Observable<ApiResponse<Vacancy>> {
    return this.http.post<ApiResponse<Vacancy>>(this.vacancyUrl, vacancy)
  }

  updateVacancy(userId: number, vacancyToUpdate: VacancyToUpdate): Observable<ApiResponse<Vacancy>> {
    return this.http.patch<ApiResponse<Vacancy>>(`${this.vacancyUrl}${userId}`, vacancyToUpdate);
  }

  deleteVacancy(vacancyId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.vacancyUrl}${vacancyId}`)
  }

  getVacanciesBySearchSettings(userId: number, searchSettings: SearchSettings): Observable<ApiResponse<Vacancy[]>> {
    let url = `${this.vacancyUrl}search?professionName=${searchSettings.searchTerm}&`;

    if (userId !== 0) {
      url += `userId=${userId}&`;
    }
    if (searchSettings.professionId) {
      url += `professionId=${searchSettings.professionId}&`;
    }
    if (searchSettings.educationTypeId) {
      url += `educationTypeId=${searchSettings.educationTypeId}&`;
    }
    if (searchSettings.employmentTypeId) {
      url += `employmentTypeId=${searchSettings.employmentTypeId}&`;
    }
    if (searchSettings.experienceLevelId) {
      url += `experienceLevelId=${searchSettings.experienceLevelId}&`;
    }
    if (searchSettings.workScheduleId) {
      url += `workScheduleId=${searchSettings.workScheduleId}&`;
    }
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }
    return this.http.get<ApiResponse<Vacancy[]>>(url);
  }

  getFavoriteVacancies(userId: number): Observable<ApiResponse<Vacancy[]>> {
    return this.http.get<ApiResponse<Vacancy[]>>(`${this.vacancyUrl}favorite?userId=${userId}`);
  }

  getVacancy(vacancyId: number): Observable<ApiResponse<Vacancy>> {
    return this.http.get<ApiResponse<Vacancy>>(`${this.vacancyUrl}vacancy/${vacancyId}`);
  }

  // Jobseeker Favorites --------------------------------------------------------------------
  toggleVacancyFavoriteStatus(jobseekerFavorite: JobseekerFavorite): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(this.jobseekerFavoriteUrl, jobseekerFavorite)
  }

  // Jobseeker Vacancy Response --------------------------------------------------------------------
  createJobseekerVacancyResponse(jobseekerVacancyResponse: JobseekerResponse): Observable<ApiResponse<JobseekerResponse>> {
    return this.http.post<ApiResponse<JobseekerResponse>>(this.jobseekerVacancyResponseUrl, jobseekerVacancyResponse);
  }

  getJobseekerResponsiveVacancies(userId: number): Observable<ApiResponse<VacancyResponse[]>> {
    return this.http.get<ApiResponse<VacancyResponse[]>>(`${this.jobseekerVacancyResponseUrl}${userId}`)
  }

  deleteJobseekerResponsiveVacancy(userId: number, vacancyId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.jobseekerVacancyResponseUrl}${userId}/${vacancyId}`)
  }

  // Employer Vacancy Response --------------------------------------------------------------------
  getEmployerVacanciesResponses(userId: number): Observable<ApiResponse<VacancyResponse[]>> {
    return this.http.get<ApiResponse<VacancyResponse[]>>(`${this.employerVacancyResponseUrl}${userId}`)
  }
}
