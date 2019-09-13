import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RasterComponent } from './raster.component';

describe('RasterComponent', () => {
  let component: RasterComponent;
  let fixture: ComponentFixture<RasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
