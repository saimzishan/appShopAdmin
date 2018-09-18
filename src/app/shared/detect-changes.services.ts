import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// We need this service to notify booking-job to call specific funtions when any button is clicked from the booking-header component

@Injectable()
export class DetectChangesService {

    notify = new Subject<any>();
    notifyObservable$ = this.notify.asObservable();

    public notifyOther(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }
}
