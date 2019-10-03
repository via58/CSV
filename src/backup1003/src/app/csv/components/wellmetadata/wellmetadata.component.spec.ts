import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellmetadataComponent } from './wellmetadata.component';

describe('WellmetadataComponent', () => {
  let component: WellmetadataComponent;
  let fixture: ComponentFixture<WellmetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellmetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellmetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
