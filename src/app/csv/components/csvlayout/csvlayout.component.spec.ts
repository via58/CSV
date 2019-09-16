import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvlayoutComponent } from './csvlayout.component';

describe('CsvlayoutComponent', () => {
  let component: CsvlayoutComponent;
  let fixture: ComponentFixture<CsvlayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvlayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
