import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject  } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class YscaleService {
    private subject = new Subject<any>();
    private yscaleService = new BehaviorSubject('');
    currentyscaleService= this.yscaleService.asObservable();

    yscaleMessage(yscale: any) {
        this.yscaleService.next(yscale)
    }

   
    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}