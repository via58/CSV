import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpencsvComponent } from './opencsv.component';

describe('OpencsvComponent', () => {
  let component: OpencsvComponent;
  let fixture: ComponentFixture<OpencsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpencsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpencsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
