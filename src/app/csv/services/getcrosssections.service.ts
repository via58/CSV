import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICrossSection } from '../interfaces/crosssection';


@Injectable()
export class GetcrosssectionsService {

   //localhost = "http://localhost:8080/"
   localhost = "http://10.10.83.80:8080/"
   crossSectionUrl = "getCrossSection/getCrossSections";
   crossSectionByIdUrl = "getCrossSection/getCrossSectionDetails?crossSectionId=";
   lasUrl = "getLas/getLasData?uwid=";
   curveNameUrl = "&curveName=";
   rasterUrl = "getRaster/getRasterData?uwid=";
   saveCrossSectionUrl = "getCrossSection/saveCrossSection";
   createCrossSectionUrl = "getCrossSection/openCrossSection?uwis=";
   deleteCrossSectionUrl = "getCrossSection/deleteCrossSection?crossSectionId=";
   getDataUrl = "getCrossSection/getWellDetails?uwis=";
   selectedProductType = "&selectedProductType=";
   curveName = "&selectedCurveName=";
   segementUrl = "&selectedSegmentNumber="

   //getCrossSection/getWellDetails?uwis=17109238520000&selectedProductType=LAS_STD&selectedCurveName=A16H



   constructor(private http: HttpClient) { }

   getConfig(): Observable<ICrossSection[]> {
      return this.http.get<ICrossSection[]>(this.localhost + this.crossSectionUrl)
   }

   getCrossSectionData(crossSectionId) {
      return this.http.get(this.localhost + this.crossSectionByIdUrl + crossSectionId)
   }
   getLasData(uwid, productType, curveName) {
      return this.http.get(this.localhost + this.getDataUrl + uwid + this.selectedProductType + productType + this.curveName + curveName)
   }
   getRasterData(uwid, productType, curveName, segment) {
      return this.http.get(this.localhost + this.getDataUrl + uwid + this.selectedProductType + productType + this.curveName + curveName + this.segementUrl + segment)
   }

   getProductTypes(uwid) {
      return this.http.get(this.localhost + 'getCrossSection/getProductTypes')
   }

   saveCrossSection(data) {
      return this.http.post(this.localhost + this.saveCrossSectionUrl, data)

   }

   CreateCrossSection(wells) {
      return this.http.get(this.localhost + this.createCrossSectionUrl + wells)
   }
   DeleteCrossSection(_crossSectionId) {
      localStorage.clear();

      return this.http.post(this.localhost + this.deleteCrossSectionUrl+_crossSectionId, {})
   }

}
