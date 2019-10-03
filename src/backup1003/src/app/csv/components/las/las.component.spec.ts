import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LasComponent } from './las.component';

describe('LasComponent', () => {
  let component: LasComponent;
  let fixture: ComponentFixture<LasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
