import { Injectable } from '@angular/core';
import {Observable,Subject} from 'rxjs';

@Injectable()
export class CsvdataService {
   
  constructor() { }
    // Observable string sources
    private wellCount = new Subject<any>();
    private missionConfirmedSource = new Subject<string>();
  
    // Observable string streams
    missionAnnounced$ = this.wellCount.asObservable();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();
    
  setState(state: any) {
    this.wellCount.next(state);
  }

  getState(): Observable<any> {
    return this.wellCount.asObservable();
  }
}
