import { TestBed } from '@angular/core/testing';

import { CsvdataService } from './csvdata.service';

describe('CsvdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CsvdataService = TestBed.get(CsvdataService);
    expect(service).toBeTruthy();
  });
});
