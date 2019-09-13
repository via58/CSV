import { TestBed } from '@angular/core/testing';

import { GetcrosssectionsService } from './getcrosssections.service';

describe('GetcrosssectionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetcrosssectionsService = TestBed.get(GetcrosssectionsService);
    expect(service).toBeTruthy();
  });
});
