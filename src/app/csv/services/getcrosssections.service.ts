import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
 

@Injectable()
export class GetcrosssectionsService {
  private getcsv = [ 
    { 
       "crossSectionId":1,
       "crossSectionName":"crossSection1",
       "wellCount":3
    },
    { 
       "crossSectionId":2,
       "crossSectionName":"crossSection2",
       "wellCount":3
    },
    { 
       "crossSectionId":3,
       "crossSectionName":"crossSection3",
       "wellCount":2
    }
 ];

  constructor(private http: HttpClient) { 
   

  }

  getConfig(){
    return this.getcsv;
  }


}
