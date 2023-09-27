import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageViewerComponent } from './package-viewer.component';

describe('PackageViewerComponent', () => {
  let component: PackageViewerComponent;
  let fixture: ComponentFixture<PackageViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PackageViewerComponent]
    });
    fixture = TestBed.createComponent(PackageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
