import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPackageComponent } from './display-package.component';

describe('DisplayPackageComponent', () => {
  let component: DisplayPackageComponent;
  let fixture: ComponentFixture<DisplayPackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisplayPackageComponent]
    });
    fixture = TestBed.createComponent(DisplayPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
