import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxsModule } from "@ngxs/store";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { JobseekerState } from "./states/jobseeker-state";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./services/interceptors/auth-interceptor";
import { loadingStatusInterceptor } from "./services/interceptors/loading-status-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxsModule.forRoot([JobseekerState]),
      NgxsStoragePluginModule.forRoot(),
      NgxsFormPluginModule.forRoot()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, loadingStatusInterceptor])
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: "enabled"
    })),
  ]
};
