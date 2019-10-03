import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvtoolsComponent } from './csvtools.component';

describe('CsvtoolsComponent', () => {
  let component: CsvtoolsComponent;
  let fixture: ComponentFixture<CsvtoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvtoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvtoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
