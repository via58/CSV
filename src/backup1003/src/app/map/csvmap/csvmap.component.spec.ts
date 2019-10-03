import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvmapComponent } from './csvmap.component';

describe('CsvmapComponent', () => {
  let component: CsvmapComponent;
  let fixture: ComponentFixture<CsvmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
