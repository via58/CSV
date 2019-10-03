import { TestBed } from '@angular/core/testing';

import { GetCrossSectionDetailsService } from './get-cross-section-details.service';

describe('GetCrossSectionDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetCrossSectionDetailsService = TestBed.get(GetCrossSectionDetailsService);
    expect(service).toBeTruthy();
  });
});
