import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class SpinnerService {
  // Observable string sources
  requestInProcessSource = new Subject<boolean>();
  // Observable string streams
  requestInProcess$ = this.requestInProcessSource.asObservable();
  // Service message commands
  requestInProcess(isRequesting: boolean) {
    setTimeout(() => {
      this.requestInProcessSource.next(isRequesting);
    }, 1);
  }
}
