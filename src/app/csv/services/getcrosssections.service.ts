import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICrossSection } from '../interfaces/crosssection';


@Injectable()
export class GetcrosssectionsService {
   
   localhost = "http://localhost:9900/"
   crossSectionUrl = "getCrossSection/getCrossSections";
   crossSectionByIdUrl = "getCrossSection/getCrossSectionDetails?crossSectionId=";
   lasUrl = "getLas/getLasData?uwid=";
   curveNameUrl = "&curveName=";
   rasterUrl = "getRaster/getRasterData?uwid=";
               

   
   constructor(private http: HttpClient) { }

   getConfig(): Observable<ICrossSection[]> {
      return this.http.get<ICrossSection[]>(this.localhost + this.crossSectionUrl)
   }

   getCrossSectionData(crossSectionId) {
      return this.http.get(this.localhost + this.crossSectionByIdUrl + crossSectionId)
   }
   getLasData(uwid, curveName) {
      return this.http.get(this.localhost + this.lasUrl + uwid + this.curveNameUrl + curveName)
   }
   getRasterData(uwid) {
      return this.http.get(this.localhost + this.rasterUrl + uwid)
   }

   getProductTypes(uwid){
      return this.http.get(this.localhost +'getCrossSection/getProductTypes')
   }


}
