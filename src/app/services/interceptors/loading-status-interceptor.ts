import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize, Observable } from "rxjs";
import { SetLoadingStatus } from "../../states/actions";
import { Store } from "@ngxs/store";

export function loadingStatusInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const store = inject(Store);
  store.dispatch(new SetLoadingStatus(true));
  return next(req).pipe(
    finalize(() => {
      store.dispatch(new SetLoadingStatus(false));
    })
  );
}


