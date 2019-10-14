import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject  } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();
    private messageService = new BehaviorSubject('');
    currentmessageService = this.messageService.asObservable();

    sendnewMessage(message: any) {
      this.messageService.next(message)
    }
    yscaleMessage(yscale: any) {
        this.messageService.next(yscale)
    }
    sendMessage(message: any) {
        this.subject.next({ message });
    }

    // sendnewMessage(newmessage: any) {
    //   this.subject.next({ newmessage });
    // }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}