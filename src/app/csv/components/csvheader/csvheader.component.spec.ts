import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvheaderComponent } from './csvheader.component';

describe('CsvheaderComponent', () => {
  let component: CsvheaderComponent;
  let fixture: ComponentFixture<CsvheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
