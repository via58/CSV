import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetCrossSectionDetailsService {

  private getcsvdetails = { 
    "crossSectionId":3,
    "crossSectionName":"crossSection3",
    "wellCount":2,
    "crossSectionDetails":[ 
       { 
          "crossSectionDetailsId":0,
          "crossSectionId":3,
          "uwi":"US01097200140000",
          "wellName":"WEFEL 29-2 #1",
          "wellNumber":"WEFEL 29-2 #1",
          "wellOrder":1,
          "crossSectionInformations":[ 
             { 
                "trackOrder":1,
                "rasterLasFlag":1,
                "curveName":"GRS",
                "curveColor":"GREEN",
                "curveThickness":1,
                "curveScale":null
             },
             { 
                "trackOrder":2,
                "rasterLasFlag":1,
                "curveName":"RHOB",
                "curveColor":"BLUE",
                "curveThickness":1,
                "curveScale":null
             },
             { 
                "trackOrder":3,
                "rasterLasFlag":1,
                "curveName":"ILD",
                "curveColor":"RED",
                "curveThickness":1,
                "curveScale":null
             }
          ],
          "curveList":[ 
 
          ]
       },
       { 
          "crossSectionDetailsId":0,
          "crossSectionId":3,
          "uwi":"US50089200210000",
          "wellName":"WEFEL 29-2 #4",
          "wellNumber":"WEFEL 29-2 #4",
          "wellOrder":2,
          "crossSectionInformations":[ 
             { 
                "trackOrder":1,
                "rasterLasFlag":0,
                "curveName":"RL",
                "curveColor":null,
                "curveThickness":0,
                "curveScale":null
             }
          ],
          "curveList":[ 
 
          ]
       }
    ]
  
 }

  constructor() { }
}
